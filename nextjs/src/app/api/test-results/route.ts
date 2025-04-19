import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import TestResult, { ITestResult, IWrongAnswer } from '../../../models/TestResult';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const testData = await request.json();
    console.log('Attempting to save test result:', testData);
    
    // Validate required fields
    if (!testData.totalTime || !testData.totalCards) {
      console.error('Invalid test data:', testData);
      return NextResponse.json(
        { error: 'Invalid test data - missing required fields' },
        { status: 400 }
      );
    }

    // Calculate score if not provided
    const score = testData.score || 
      ((testData.totalCards - testData.wrongAnswers.length) / testData.totalCards * 100);

    // Ensure proper data structure
    const sanitizedData: Partial<ITestResult> = {
      date: new Date(),
      totalTime: Number(testData.totalTime),
      totalCards: Number(testData.totalCards),
      score: Number(score),
      wrongAnswers: testData.wrongAnswers.map((wrong: { cardname: string; userAnswer: string; correctAnswer: string }) => ({
        cardname: String(wrong.cardname),
        userAnswer: String(wrong.userAnswer),
        correctAnswer: String(wrong.correctAnswer)
      })),
      settings: {
        selectedSuit: testData.settings.selectedSuit,
        chunkSize: Number(testData.settings.chunkSize)
      }
    };
    
    const testResult = await TestResult.create(sanitizedData);
    console.log('Test result saved successfully:', testResult);
    return NextResponse.json(testResult);
  } catch (error) {
    console.error('Error saving test result:', error);
    return NextResponse.json(
      { error: 'Failed to save test result', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    console.log('Fetching test results...');
    const results = await TestResult.find({})
      .sort({ date: -1 })
      .limit(10)
      .lean()
      .exec();
    
    console.log(`Found ${results.length} test results`);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching test results:', error);
    return NextResponse.json(
      { error: 'Failed to fetch test results', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 