import { db } from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import type { Claim, ClaimStatus, ClaimFilters, ClaimListResponse } from '@/types/claims';

export class ClaimRepository {
  async create(claimData: Omit<Claim, 'id' | 'createdAt' | 'updatedAt'>): Promise<Claim> {
    const query = `
      INSERT INTO claims (
        claimCode, status, type, productType, productName, amount,
        firstName, lastName, documentType, documentNumber, email, phone,
        address, isMinor, guardianName, description, consumerRequest,
        ipAddress, userAgent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      claimData.claimCode,
      claimData.status,
      claimData.type,
      claimData.productType,
      claimData.productName,
      claimData.amount,
      claimData.firstName,
      claimData.lastName,
      claimData.documentType,
      claimData.documentNumber,
      claimData.email,
      claimData.phone,
      claimData.address,
      claimData.isMinor,
      claimData.guardianName,
      claimData.description,
      claimData.consumerRequest,
      claimData.ipAddress,
      claimData.userAgent
    ];

    const [result] = await db.query<ResultSetHeader>(query, values);
    return this.findById(result.insertId);
  }

  async findById(id: number): Promise<Claim> {
    const query = 'SELECT * FROM claims WHERE id = ?';
    const [rows] = await db.query<RowDataPacket[]>(query, [id]);

    if (rows.length === 0) {
      throw new Error('Reclamo no encontrado');
    }

    return rows[0] as Claim;
  }

  async findByCode(claimCode: string): Promise<Claim | null> {
    const query = 'SELECT * FROM claims WHERE claimCode = ?';
    const [rows] = await db.query<RowDataPacket[]>(query, [claimCode]);

    return rows.length > 0 ? (rows[0] as Claim) : null;
  }

  async findAll(filters: ClaimFilters): Promise<ClaimListResponse> {
    const {
      search,
      status,
      type,
      startDate,
      endDate,
      orderBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 20
    } = filters;

    let query = 'SELECT * FROM claims WHERE 1=1';
    const params: any[] = [];

    if (search) {
      query += ` AND (
        claimCode LIKE ? OR
        firstName LIKE ? OR
        lastName LIKE ? OR
        email LIKE ? OR
        documentNumber LIKE ? OR
        productName LIKE ?
      )`;
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
    }

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    if (startDate) {
      query += ' AND DATE(createdAt) >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND DATE(createdAt) <= ?';
      params.push(endDate);
    }

    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const [countResult] = await db.query<RowDataPacket[]>(countQuery, params);
    const total = countResult[0].total;

    query += ` ORDER BY ${orderBy} ${order.toUpperCase()}`;

    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await db.query<RowDataPacket[]>(query, params);

    return {
      claims: rows as Claim[],
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async updateStatus(id: number, status: ClaimStatus): Promise<void> {
    const query = 'UPDATE claims SET status = ? WHERE id = ?';
    await db.query(query, [status, id]);
  }

  async getNextSequenceNumber(year: number): Promise<number> {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      const [rows] = await connection.query<RowDataPacket[]>(
        'SELECT lastNumber FROM claim_sequence WHERE year = ? FOR UPDATE',
        [year]
      );

      let nextNumber: number;

      if (rows.length === 0) {
        nextNumber = 1;
        await connection.query(
          'INSERT INTO claim_sequence (year, lastNumber) VALUES (?, ?)',
          [year, nextNumber]
        );
      } else {
        nextNumber = rows[0].lastNumber + 1;
        await connection.query(
          'UPDATE claim_sequence SET lastNumber = ? WHERE year = ?',
          [nextNumber, year]
        );
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
    let query = 'SELECT COUNT(*) as total FROM claims';
    const params: any[] = [];

    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }

    const [rows] = await db.query<RowDataPacket[]>(query, params);
    return rows[0].total;
  }

  async getRecentClaims(limit: number = 10): Promise<Claim[]> {
    const query = 'SELECT * FROM claims ORDER BY createdAt DESC LIMIT ?';
    const [rows] = await db.query<RowDataPacket[]>(query, [limit]);
    return rows as Claim[];
  }

  async exportToCSV(filters: ClaimFilters): Promise<Claim[]> {
    const { claims } = await this.findAll({ ...filters, limit: 10000 });
    return claims;
  }
}

export const claimRepository = new ClaimRepository();
