import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'
import bcrypt from 'bcryptjs'
import { Site, User, SITE_TYPES } from '../types'
import { createLogger } from './logger'

const logger = createLogger('database')

export class DatabaseService {
  private db: Database.Database

  constructor() {
    const defaultDevDbPath = path.join(process.cwd(), 'data', 'data.db')
    const defaultProdDbPath = '/data/data.db'
    const nodeEnv = process.env.NODE_ENV || 'development'
    const envDbPath = process.env.DB_PATH

    let resolvedDbPath = defaultDevDbPath

    if (nodeEnv === 'production') {
      resolvedDbPath = envDbPath || defaultProdDbPath
    }

    const dbDirectory = path.dirname(resolvedDbPath)
    if (!fs.existsSync(dbDirectory)) {
      fs.mkdirSync(dbDirectory, { recursive: true })
    }

    this.db = new Database(resolvedDbPath)
    logger.info('Database connection established', {
      dbPath: resolvedDbPath,
    })
    this.initTables()
    this.createDefaultUser()
  }

  private initTables() {
    logger.info('Initializing database tables')

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS sites (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        access_token TEXT NOT NULL,
        url TEXT NOT NULL,
        description TEXT,
        user_id INTEGER NOT NULL,
        type TEXT DEFAULT '${SITE_TYPES.NEW_API}',
        username TEXT,
        used_quota INTEGER,
        quota INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `)

    logger.info('Database initialization complete')
  }

  private createDefaultUser() {
    const adminUsername = 'admin'
    const existingUser = this.getUser(adminUsername)
    if (!existingUser) {
      logger.info('Creating default admin user')
      const providedPassword = process.env.ADMIN_INITIAL_PASSWORD
      logger.info('ADMIN_INITIAL_PASSWORD', { providedPassword })
      const nodeEnv = process.env.NODE_ENV || 'development'

      if (!providedPassword && nodeEnv === 'production') {
        logger.error('ADMIN_INITIAL_PASSWORD is required.')
        throw new Error(
          'ADMIN_INITIAL_PASSWORD is required in production for first-time admin creation'
        )
      }

      const initialPassword = providedPassword || 'admin123456'
      const passwordHash = bcrypt.hashSync(initialPassword, 10)
      this.db
        .prepare(
          `
        INSERT INTO users (id, username, password_hash)
        VALUES (?, ?, ?)
      `
        )
        .run(adminUsername, adminUsername, passwordHash)
      logger.info('Default admin user created successfully')
    } else {
      logger.debug('Default admin user already exists')
    }
  }

  getUser(username: string): User | null {
    const row = this.db
      .prepare(
        `
      SELECT id, username, password_hash as passwordHash, created_at as createdAt, updated_at as updatedAt
      FROM users WHERE username = ?
    `
      )
      .get(username) as User

    if (!row) return null

    return {
      ...row,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    }
  }

  async verifyPassword(username: string, password: string): Promise<boolean> {
    const user = this.getUser(username)
    if (!user) return false
    return bcrypt.compare(password, user.passwordHash)
  }

  async updatePassword(
    username: string,
    newPassword: string
  ): Promise<boolean> {
    try {
      const passwordHash = await bcrypt.hash(newPassword, 10)
      const now = new Date().toISOString()

      const result = this.db
        .prepare(
          `
        UPDATE users SET password_hash = ?, updated_at = ?
        WHERE username = ?
      `
        )
        .run(passwordHash, now, username)

      logger.info('Password updated successfully', {
        username,
        changes: result.changes,
      })

      return result.changes > 0
    } catch (error) {
      logger.error('Failed to update password', {
        username,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      return false
    }
  }

  getAllSites(): Site[] {
    const rows = this.db
      .prepare(
        `
      SELECT id, name, access_token as accessToken, url, description, user_id as userId, type,
             username, used_quota as usedQuota, quota, created_at as createdAt, updated_at as updatedAt
      FROM sites ORDER BY created_at DESC
    `
      )
      .all() as Site[]

    return rows.map((row) => ({
      ...row,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    }))
  }

  getSite(id: string): Site | null {
    const row = this.db
      .prepare(
        `
      SELECT id, name, access_token as accessToken, url, description, user_id as userId, type,
             username, used_quota as usedQuota, quota, created_at as createdAt, updated_at as updatedAt
      FROM sites WHERE id = ?
    `
      )
      .get(id) as Site

    if (!row) return null

    return {
      ...row,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    }
  }

  addSite(site: Omit<Site, 'id' | 'createdAt' | 'updatedAt'>): Site {
    const id = crypto.randomUUID()
    const now = new Date().toISOString()

    logger.info('Adding new site to database', {
      siteName: site.name,
      siteType: site.type,
    })

    this.db
      .prepare(
        `
      INSERT INTO sites (id, name, access_token, url, description, user_id, type, username, used_quota, quota, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
      )
      .run(
        id,
        site.name,
        site.accessToken,
        site.url,
        site.description || '',
        site.userId,
        site.type || SITE_TYPES.NEW_API,
        site.username || null,
        site.usedQuota || null,
        site.quota || null,
        now,
        now
      )

    logger.info('Site added to database successfully', {
      siteId: id,
      siteName: site.name,
    })

    return {
      ...site,
      id,
      type: site.type || SITE_TYPES.NEW_API,
      description: site.description || '',
      createdAt: new Date(now),
      updatedAt: new Date(now),
    }
  }

  updateSite(
    id: string,
    updates: Partial<
      Pick<
        Site,
        | 'name'
        | 'accessToken'
        | 'url'
        | 'description'
        | 'userId'
        | 'type'
        | 'username'
        | 'usedQuota'
        | 'quota'
      >
    >
  ) {
    logger.debug('Updating site', {
      siteId: id,
      updateFields: Object.keys(updates),
    })

    const setParts: string[] = []
    const values: unknown[] = []

    if (updates.name !== undefined) {
      setParts.push('name = ?')
      values.push(updates.name)
    }
    if (updates.accessToken !== undefined) {
      setParts.push('access_token = ?')
      values.push(updates.accessToken)
    }
    if (updates.url !== undefined) {
      setParts.push('url = ?')
      values.push(updates.url)
    }
    if (updates.description !== undefined) {
      setParts.push('description = ?')
      values.push(updates.description)
    }
    if (updates.userId !== undefined) {
      setParts.push('user_id = ?')
      values.push(updates.userId)
    }
    if (updates.type !== undefined) {
      setParts.push('type = ?')
      values.push(updates.type)
    }
    if (updates.username !== undefined) {
      setParts.push('username = ?')
      values.push(updates.username)
    }
    if (updates.usedQuota !== undefined) {
      setParts.push('used_quota = ?')
      values.push(updates.usedQuota)
    }
    if (updates.quota !== undefined) {
      setParts.push('quota = ?')
      values.push(updates.quota)
    }

    if (setParts.length === 0) {
      logger.debug('No updates to apply for site', { siteId: id })
      return
    }

    setParts.push('updated_at = ?')
    values.push(new Date().toISOString())
    values.push(id)

    this.db
      .prepare(
        `
      UPDATE sites SET ${setParts.join(', ')} WHERE id = ?
    `
      )
      .run(...values)

    logger.debug('Site updated successfully', {
      siteId: id,
      updatedFields: setParts.length - 1,
    })
  }

  deleteSite(id: string) {
    logger.info('Deleting site from database', { siteId: id })
    this.db.prepare('DELETE FROM sites WHERE id = ?').run(id)
    logger.info('Site deleted successfully', { siteId: id })
  }

  close() {
    logger.info('Closing database connection')
    this.db.close()
  }
}
