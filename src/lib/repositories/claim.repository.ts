import { getPool } from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import type { Claim, ClaimStatus, ClaimFilters } from '@/types/claims';

export class ClaimRepository {
  async create(claimData: Omit<Claim, 'id' | 'createdAt' | 'updatedAt'>): Promise<Claim> {
    const sql = `
      INSERT INTO claims (
        claimCode, status, type, productType, productName, amount,
        firstName, lastName, documentType, documentNumber, email, phone,
        address, isMinor, guardianName, description, consumerRequest,
        ipAddress, userAgent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      claimData.claimCode, claimData.status, claimData.type, claimData.productType,
      claimData.productName, claimData.amount, claimData.firstName, claimData.lastName,
      claimData.documentType, claimData.documentNumber, claimData.email, claimData.phone,
      claimData.address, claimData.isMinor, claimData.guardianName, claimData.description,
      claimData.consumerRequest, claimData.ipAddress, claimData.userAgent
    ];

    const [result] = await getPool().execute<ResultSetHeader>(sql, values);
    return this.findById(result.insertId);
  }

  async findById(id: number): Promise<Claim> {
    const sql = 'SELECT * FROM claims WHERE id = ?';
    const [rows] = await getPool().execute<RowDataPacket[]>(sql, [id]);
    if (rows.length === 0) throw new Error('Reclamo no encontrado');
    return rows[0] as Claim;
  }

  async findByCode(claimCode: string): Promise<Claim | null> {
    const sql = 'SELECT * FROM claims WHERE claimCode = ?';
    const [rows] = await getPool().execute<RowDataPacket[]>(sql, [claimCode]);
    return rows.length > 0 ? (rows[0] as Claim) : null;
  }

  async findAll(filters: ClaimFilters) {
    const { search, status, type, page = 1, limit = 20, orderBy = 'createdAt', order = 'desc' } = filters;

    let sql = 'SELECT * FROM claims WHERE 1=1';
    const params: any[] = [];

    if (search) {
      sql += ` AND (claimCode LIKE ? OR firstName LIKE ? OR lastName LIKE ? OR email LIKE ?)`;
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }
    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }
    if (type) {
      sql += ' AND type = ?';
      params.push(type);
    }

    const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total');
    const [countResult] = await getPool().execute<RowDataPacket[]>(countSql, params);
    const total = countResult[0].total;

    sql += ` ORDER BY ${orderBy} ${order.toUpperCase()} LIMIT ? OFFSET ?`;
    params.push(limit, (page - 1) * limit);

    const [rows] = await getPool().execute<RowDataPacket[]>(sql, params);

    return {
      claims: rows as Claim[],
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async updateStatus(id: number, status: ClaimStatus): Promise<void> {
    await getPool().execute('UPDATE claims SET status = ? WHERE id = ?', [status, id]);
  }

  async getNextSequenceNumber(year: number): Promise<number> {
    const connection = await getPool().getConnection();
    try {
      await connection.beginTransaction();
      const [rows] = await connection.execute<RowDataPacket[]>(
        'SELECT lastNumber FROM claim_sequence WHERE year = ? FOR UPDATE', [year]
      );

      let nextNumber: number;
      if (rows.length === 0) {
        nextNumber = 1;
        await connection.execute('INSERT INTO claim_sequence (year, lastNumber) VALUES (?, ?)', [year, nextNumber]);
      } else {
        nextNumber = rows[0].lastNumber + 1;
        await connection.execute('UPDATE claim_sequence SET lastNumber = ? WHERE year = ?', [nextNumber, year]);
      }

      await connection.commit();
      return nextNumber;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async countByStatus(status?: ClaimStatus): Promise<number> {
    let sql = 'SELECT COUNT(*) as total FROM claims';
    const params: any[] = [];
    if (status) {
      sql += ' WHERE status = ?';
      params.push(status);
    }
    const [rows] = await getPool().execute<RowDataPacket[]>(sql, params);
    return rows[0].total;
  }
}

export const claimRepository = new ClaimRepository();
