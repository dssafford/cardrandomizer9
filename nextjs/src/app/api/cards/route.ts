import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Card from '../../../models/Card';

export async function GET() {
  try {
    await dbConnect();
    const cards = await Card.find({}).lean();
    return NextResponse.json(cards);
  } catch (error) {
    console.error('Error in GET /api/cards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cards', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await dbConnect();
    const card = await Card.create(body);
    return NextResponse.json(card, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/cards:', error);
    return NextResponse.json(
      { error: 'Failed to create card', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Seed endpoint to populate initial cards
export async function PUT(request: Request) {
  try {
    await dbConnect();
    const initialCards = [
      { cardname: 'ace_of_hearts', person_name: 'peyton', action_name: 'throwing', object_name: 'football', card_number: '1' },
      { cardname: '2_of_hearts', person_name: 'anna', action_name: 'picking up', object_name: 'tennis ball', card_number: '2' },
      { cardname: '3_of_hearts', person_name: 'tom', action_name: 'running', object_name: 'braces', card_number: '3' },
      { cardname: '4_of_hearts', person_name: 'scarlett', action_name: 'drinking', object_name: 'booze bottle', card_number: '4' },
      { cardname: '5_of_hearts', person_name: 'julian', action_name: 'disappearing', object_name: 'puff of smoke', card_number: '5' },
      { cardname: '6_of_hearts', person_name: 'taylor', action_name: 'kissing', object_name: 'microphone', card_number: '6' },
      { cardname: '7_of_hearts', person_name: 'johnny', action_name: 'punching', object_name: 'window', card_number: '7' },
      { cardname: '8_of_hearts', person_name: 'pam', action_name: 'prancing', object_name: 'beach', card_number: '8' },
      { cardname: '9_of_hearts', person_name: 'steve', action_name: 'stomping', object_name: 'iphone', card_number: '9' },
      { cardname: '10_of_hearts', person_name: 'ivanka', action_name: 'smiling', object_name: 'convention', card_number: '10' },
      { cardname: 'jack_of_hearts', person_name: 'jesus', action_name: 'walking', object_name: 'lake', card_number: '11' },
      { cardname: 'queen_of_hearts', person_name: 'michelle', action_name: 'jumping', object_name: 'garden', card_number: '12' },
      { cardname: 'king_of_hearts', person_name: 'barak', action_name: 'swatting', object_name: 'fly', card_number: '13' },
      { cardname: 'ace_of_diamonds', person_name: 'michael', action_name: 'dunking', object_name: 'basketball', card_number: '14' },
      { cardname: '2_of_diamonds', person_name: 'maria', action_name: 'swinging', object_name: 'tennis racket', card_number: '15' },
      { cardname: '3_of_diamonds', person_name: 'george', action_name: 'smoking', object_name: 'cigar', card_number: '16' },
      { cardname: '4_of_diamonds', person_name: 'julia', action_name: 'zipping', object_name: 'boots', card_number: '17' },
      { cardname: '5_of_diamonds', person_name: 'trump', action_name: 'tweeting', object_name: 'blackberry', card_number: '18' },
      { cardname: '6_of_diamonds', person_name: 'madonna', action_name: 'singing', object_name: 'street', card_number: '19' },
      { cardname: '7_of_diamonds', person_name: 'kevin', action_name: 'riding', object_name: 'horse', card_number: '20' },
      { cardname: '8_of_diamonds', person_name: 'marilyn', action_name: 'strutting', object_name: 'diamonds', card_number: '21' },
      { cardname: '9_of_diamonds', person_name: 'bill', action_name: 'pouring coffee', object_name: 'pc', card_number: '22' },
      { cardname: '10_of_diamonds', person_name: 'oprah', action_name: 'interviewing', object_name: 'couch', card_number: '23' },
      { cardname: 'jack_of_diamonds', person_name: 'zeus', action_name: 'pointing finger', object_name: 'swan', card_number: '24' },
      { cardname: 'queen_of_diamonds', person_name: 'princess', action_name: 'posing', object_name: 'polkadot dress', card_number: '25' },
      { cardname: 'king_of_diamonds', person_name: 'prince', action_name: 'piloting', object_name: 'helicopter', card_number: '26' },
      { cardname: 'ace_of_spades', person_name: 'rodman', action_name: 'diving', object_name: 'photographer', card_number: '27' },
      { cardname: '2_of_spades', person_name: 'paige', action_name: 'sipping', object_name: 'wine', card_number: '28' },
      { cardname: '3_of_spades', person_name: 'ben', action_name: 'hooking up', object_name: 'lie detector', card_number: '29' },
      { cardname: '4_of_spades', person_name: 'reece', action_name: 'strumming', object_name: 'guitar', card_number: '30' },
      { cardname: '5_of_spades', person_name: 'osama', action_name: 'exploding', object_name: 'suicide vest', card_number: '31' },
      { cardname: '6_of_spades', person_name: 'lady gaga', action_name: 'licking', object_name: 'meat suit', card_number: '32' },
      { cardname: '7_of_spades', person_name: 'anthony', action_name: 'taking selfie', object_name: 'mirror', card_number: '33' },
      { cardname: '8_of_spades', person_name: 'naomi', action_name: 'driving', object_name: 'convertable', card_number: '34' },
      { cardname: '9_of_spades', person_name: 'mr', action_name: 'poking', object_name: 'queen', card_number: '35' },
      { cardname: '10_of_spades', person_name: 'sarah', action_name: 'spearing', object_name: 'moose', card_number: '36' },
      { cardname: 'jack_of_spades', person_name: 'dali', action_name: 'praying', object_name: 'buddha statue', card_number: '37' },
      { cardname: 'queen_of_spades', person_name: 'victoria', action_name: 'applying', object_name: 'lipstick', card_number: '38' },
      { cardname: 'king_of_spades', person_name: 'david', action_name: 'kicking', object_name: 'soccer ball', card_number: '39' },
      { cardname: 'ace_of_clubs', person_name: 'ali', action_name: 'boxing', object_name: 'ring', card_number: '40' },
      { cardname: '2_of_clubs', person_name: 'serena', action_name: 'rubbing', object_name: 'trophy', card_number: '41' },
      { cardname: '3_of_clubs', person_name: 'brad', action_name: 'eating', object_name: 'hamburger', card_number: '42' },
      { cardname: '4_of_clubs', person_name: 'angelina', action_name: 'karate chop', object_name: 'face', card_number: '43' },
      { cardname: '5_of_clubs', person_name: 'hitler', action_name: 'goosestepping', object_name: 'bunker', card_number: '44' },
      { cardname: '6_of_clubs', person_name: 'witch', action_name: 'flying', object_name: 'broom', card_number: '45' },
      { cardname: '7_of_clubs', person_name: 'arnold', action_name: 'shooting', object_name: 'machine gun', card_number: '46' },
      { cardname: '8_of_clubs', person_name: 'medusa', action_name: 'staring', object_name: 'stone', card_number: '47' },
      { cardname: '9_of_clubs', person_name: 'bill', action_name: 'wagging finger', object_name: 'blue dress', card_number: '48' },
      { cardname: '10_of_clubs', person_name: 'hillary', action_name: 'cutting up', object_name: 'poster', card_number: '49' },
      { cardname: 'jack_of_clubs', person_name: 'pope', action_name: 'spitting', object_name: 'grail', card_number: '50' },
      { cardname: 'queen_of_clubs', person_name: 'beyonce', action_name: 'twerking', object_name: 'stage', card_number: '51' },
      { cardname: 'king_of_clubs', person_name: 'jz', action_name: 'spinning', object_name: 'record', card_number: '52' }
    ];

    await Card.deleteMany({});
    const cards = await Card.insertMany(initialCards);
    return NextResponse.json(cards, { status: 200 });
  } catch (error) {
    console.error('Error in PUT /api/cards:', error);
    return NextResponse.json(
      { error: 'Failed to seed cards', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 