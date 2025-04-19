import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import WrongCard, { IWrongCard } from '@/models/WrongCard';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    console.log('Received wrong card data:', data);

    // Validate required fields
    const requiredFields = ['cardname', 'person_name', 'action_name', 'object_name', 'userAnswer'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields, 'Data received:', data);
      return NextResponse.json({ 
        error: 'Missing required fields', 
        details: `Missing: ${missingFields.join(', ')}`,
        receivedData: data
      }, { status: 400 });
    }

    // Try to find existing wrong card
    let wrongCard = await WrongCard.findOne({ cardname: data.cardname }).exec();
    console.log('Found existing wrong card:', wrongCard);

    try {
      if (wrongCard) {
        // Update existing wrong card
        wrongCard.mistakeCount += 1;
        wrongCard.lastMistakeDate = new Date();
        wrongCard.userAnswer = data.userAnswer;
        wrongCard.person_name = data.person_name;
        wrongCard.action_name = data.action_name;
        wrongCard.object_name = data.object_name;
        await wrongCard.save();
        console.log('Updated wrong card:', wrongCard);
      } else {
        // Create new wrong card with all required fields
        wrongCard = await WrongCard.create({
          cardname: data.cardname,
          person_name: data.person_name,
          action_name: data.action_name,
          object_name: data.object_name,
          userAnswer: data.userAnswer,
          mistakeCount: 1,
          lastMistakeDate: new Date()
        });
        console.log('Created new wrong card:', wrongCard);
      }

      return NextResponse.json(wrongCard);
    } catch (dbError) {
      console.error('Database operation failed:', dbError);
      return NextResponse.json({ 
        error: 'Database operation failed',
        details: dbError instanceof Error ? dbError.message : 'Unknown database error'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in wrong cards POST route:', error);
    return NextResponse.json({ 
      error: 'Failed to save wrong card',
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const wrongCards = await WrongCard.find()
      .sort({ lastMistakeDate: -1 })
      .lean()
      .exec();
    
    console.log('Fetched wrong cards:', wrongCards.length);
    return NextResponse.json(wrongCards);
  } catch (error) {
    console.error('Error fetching wrong cards:', error);
    return NextResponse.json({ error: 'Failed to fetch wrong cards' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await dbConnect();
    const { cardname } = await request.json();
    console.log('Attempting to delete wrong card:', cardname);
    const result = await WrongCard.findOneAndDelete({ cardname });
    console.log('Delete result:', result);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting wrong card:', error);
    return NextResponse.json(
      { error: 'Failed to delete wrong card', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 