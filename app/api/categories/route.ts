import { NextResponse } from 'next/server'
import { categories } from '@/lib/data'
import type { ApiResponse } from '@/lib/types'

/**
 * GET /api/categories
 * Fetch all product categories
 */
export async function GET() {
  try {
    const response: ApiResponse<string[]> = {
      success: true,
      data: categories,
    }

    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch categories',
      message: error instanceof Error ? error.message : 'Unknown error',
    }
    return NextResponse.json(response, { status: 500 })
  }
}
