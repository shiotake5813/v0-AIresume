import { NextRequest, NextResponse } from 'next/server'
import { getDocumentById, updateDocument, deleteDocument } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const document = await getDocumentById(params.id)
    
    if (!document) {
      return NextResponse.json(
        {
          success: false,
          error: 'Document not found'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      document,
      message: 'Document retrieved successfully'
    })
  } catch (error: any) {
    console.error('API Error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch document',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const document = await updateDocument(params.id, body)

    return NextResponse.json({
      success: true,
      document,
      message: 'Document updated successfully'
    })
  } catch (error: any) {
    console.error('API Error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update document',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteDocument(params.id)

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully'
    })
  } catch (error: any) {
    console.error('API Error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete document',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
