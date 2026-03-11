import { NextRequest, NextResponse } from 'next/server'
import { products } from '@/lib/data'
import type { ApiResponse, Product } from '@/lib/types'

/**
 * GET /api/products/[id]
 * Fetch a single product by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const product = products.find((p) => p.id === id)

    if (!product) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Product not found',
        message: `No product found with ID: ${id}`,
      }
      return NextResponse.json(response, { status: 404 })
    }

    const response: ApiResponse<Product> = {
      success: true,
      data: product,
    }

    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch product',
      message: error instanceof Error ? error.message : 'Unknown error',
    }
    return NextResponse.json(response, { status: 500 })
  }
}

/**
 * PUT /api/products/[id]
 * Update a product (for future admin functionality)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // For future: Update product in database
    return NextResponse.json({
      success: false,
      error: 'Product update not implemented',
    }, { status: 501 })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Invalid request',
    }, { status: 400 })
  }
}

/**
 * DELETE /api/products/[id]
 * Delete a product (for future admin functionality)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // For future: Delete product from database
    return NextResponse.json({
      success: false,
      error: 'Product deletion not implemented',
    }, { status: 501 })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Invalid request',
    }, { status: 400 })
  }
}
