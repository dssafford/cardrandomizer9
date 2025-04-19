'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ICard } from '@/models/Card';

export default function CardDisplay() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cards, setCards] = useState<ICard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(-1);
  const [selectedSuit, setSelectedSuit] = useState<string | null>(null);
  const [chunkSize, setChunkSize] = useState<number>(52);
  const [activeCards, setActiveCards] = useState<ICard[]>([]);
  const [practiceMode, setPracticeMode] = useState<'all' | 'wrong'>('all');
  const [wrongCards, setWrongCards] = useState<ICard[]>([]);
  const [showInfo, setShowInfo] = useState<{
    person: boolean;
    action: boolean;
    object: boolean;
  }>({
    person: false,
    action: false,
    object: false
  });
  const [testComplete, setTestComplete] = useState<boolean>(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [wrongAnswers, setWrongAnswers] = useState<Array<{card: ICard, answer: string}>>([]);
  const [timer, setTimer] = useState({
    isRunning: false,
    seconds: 0
  });
  const [testHistory, setTestHistory] = useState<any[]>([]);

  useEffect(() => {
    fetchCards();
    fetchTestHistory();
    fetchWrongCards();
    // Check system preference on mount
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer.isRunning) {
      interval = setInterval(() => {
        setTimer(prev => ({
          ...prev,
          seconds: prev.seconds + 1
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer.isRunning]);

  const fetchCards = async () => {
    try {
      const response = await fetch('/api/cards');
      if (!response.ok) throw new Error('Failed to fetch cards');
      const data = await response.json();
      console.log('Fetched cards:', data);
      setCards(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching cards:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchTestHistory = async () => {
    try {
      const response = await fetch('/api/test-results');
      if (!response.ok) throw new Error('Failed to fetch test history');
      const data = await response.json();
      setTestHistory(data);
    } catch (err) {
      console.error('Failed to fetch test history:', err);
    }
  };

  const fetchWrongCards = async () => {
    try {
      console.log('Fetching wrong cards...');
      const response = await fetch('/api/wrong-cards');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched wrong cards:', data);
      console.log('Number of wrong cards:', Array.isArray(data) ? data.length : 'Data is not an array');
      setWrongCards(Array.isArray(data) ? data : []);
      
      // Log the state after update
      setTimeout(() => {
        console.log('Wrong cards state after update:', wrongCards.length);
      }, 0);
    } catch (err) {
      console.error('Error fetching wrong cards:', err);
      setWrongCards([]); // Reset to empty array on error
    }
  };

  // Add effect to monitor wrongCards state
  useEffect(() => {
    console.log('Wrong cards state changed:', wrongCards.length);
  }, [wrongCards]);

  const seedCards = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/cards', { 
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to seed cards: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Cards seeded successfully:', result);
      await fetchCards(); // Refresh the cards list
    } catch (err) {
      console.error('Error seeding cards:', err);
      setError(err instanceof Error ? err.message : 'Failed to seed cards');
    } finally {
      setLoading(false);
    }
  };

  const shuffleCards = () => {
    let cardsToUse = [...cards];
    
    // Handle wrong cards separately from suit selection
    if (practiceMode === 'wrong') {
      cardsToUse = [...wrongCards];
    } else {
      // Filter by suit first if selected
      if (selectedSuit) {
        console.log(`Filtering by suit: ${selectedSuit}`);
        cardsToUse = cardsToUse.filter(card => card.cardname.toLowerCase().includes(selectedSuit.toLowerCase()));
        console.log(`After suit filter: ${cardsToUse.length} cards`);
      }
    }
    
    // Shuffle the filtered cards
    cardsToUse = cardsToUse.sort(() => Math.random() - 0.5);
    
    // Apply chunk size if not in wrong cards mode
    if (practiceMode !== 'wrong') {
      const effectiveChunkSize = Math.min(chunkSize, cardsToUse.length);
      console.log(`Applying chunk size ${effectiveChunkSize} to ${cardsToUse.length} cards`);
      cardsToUse = cardsToUse.slice(0, effectiveChunkSize);
    }
    
    // Final shuffle and state updates
    setActiveCards(cardsToUse.sort(() => Math.random() - 0.5));
    setCurrentCardIndex(-1);
    setShowInfo({
      person: false,
      action: false,
      object: false
    });
    setTimer({ isRunning: false, seconds: 0 });
    setWrongAnswers([]);
    setTestComplete(false);
    
    console.log(`Final active cards: ${cardsToUse.length} cards${selectedSuit ? ` (${selectedSuit})` : ''}`);
  };

  const startTest = () => {
    if (activeCards.length === 0) {
      shuffleCards();
    }
    setCurrentCardIndex(0);
    setTimer({ isRunning: true, seconds: 0 });
  };

  const toggleInfo = (type: 'person' | 'action' | 'object') => {
    setShowInfo(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const checkAnswer = (answer: string, card: ICard): boolean => {
    return answer.toLowerCase() === card.person_name?.toLowerCase();
  };

  const handleWrongAnswer = async (card: ICard, userAnswer: string) => {
    try {
      console.log('Saving wrong card with data:', {
        cardname: card.cardname,
        person_name: card.person_name,
        action_name: card.action_name,
        object_name: card.object_name,
        userAnswer: userAnswer
      });

      const response = await fetch('/api/wrong-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardname: card.cardname,
          person_name: card.person_name,
          action_name: card.action_name,
          object_name: card.object_name,
          userAnswer: userAnswer
        }),
      });

      console.log('Wrong card API response status:', response.status);
      const data = await response.json();
      console.log('Wrong card API response data:', data);
      
      if (!response.ok) {
        console.error('Failed to save wrong card:', data);
        throw new Error(data.details || data.error || 'Failed to save wrong card');
      }

      console.log('Successfully saved wrong card:', data);
      return data;
    } catch (error) {
      console.error('Error handling wrong answer:', error);
      setError(error instanceof Error ? error.message : 'Failed to save wrong answer. Please try again.');
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCard) return;

    const isCorrect = checkAnswer(userAnswer, currentCard);
    const isLastCard = currentCardIndex === activeCards.length - 1;

    console.log('Submitting answer:', {
      userAnswer,
      isCorrect,
      isLastCard,
      currentCard: currentCard.cardname
    });

    // Save wrong answer if incorrect
    if (!isCorrect) {
      const wrongAnswer = { 
        card: currentCard, 
        answer: userAnswer 
      };
      console.log('Adding wrong answer to state:', wrongAnswer);
      setWrongAnswers(prev => [...prev, wrongAnswer]);
      await handleWrongAnswer(currentCard, userAnswer);
    }

    // Show the correct answer
    setShowInfo({ person: true, action: true, object: true });

    if (isLastCard) {
      // Stop the timer immediately for the last card
      setTimer(prev => ({ ...prev, isRunning: false }));
      
      // Prepare test results data
      const testData = {
        date: new Date(),
        totalTime: timer.seconds,
        totalCards: activeCards.length,
        rightAnswers: activeCards.length - wrongAnswers.length,
        wrongAnswers: wrongAnswers.map(wrong => ({
          cardname: wrong.card.cardname,
          userAnswer: wrong.answer || '',
          correctAnswer: wrong.card.person_name || ''
        })),
        score: ((activeCards.length - wrongAnswers.length) / activeCards.length * 100).toFixed(1),
        settings: {
          selectedSuit,
          chunkSize
        }
      };

      // Add the last wrong answer if it was incorrect
      if (!isCorrect) {
        testData.wrongAnswers.push({
          cardname: currentCard.cardname,
          userAnswer: userAnswer || '',
          correctAnswer: currentCard.person_name || ''
        });
        testData.rightAnswers = activeCards.length - (wrongAnswers.length + 1);
        testData.score = ((testData.rightAnswers / activeCards.length) * 100).toFixed(1);
      }

      try {
        // Save test results
        const response = await fetch('/api/test-results', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...testData,
            settings: {
              selectedSuit,
              chunkSize
            }
          })
        });

        console.log('Test results API response status:', response.status);
        const responseText = await response.text();
        console.log('Raw test results response:', responseText);

        let responseData;
        try {
          responseData = JSON.parse(responseText);
          console.log('Parsed test results response:', responseData);
        } catch (e) {
          console.error('Failed to parse test results response:', e);
          throw new Error('Invalid JSON response from server');
        }

        if (!response.ok) {
          throw new Error(responseData.error || responseData.details || `HTTP error! status: ${response.status}`);
        }

        // Fetch updated test history
        await fetchTestHistory();
        
        // Show the correct answer for 2 seconds, then transition to test complete
        setTimeout(() => {
          setTestComplete(true);
          setCurrentCardIndex(activeCards.length); // Ensure we're past the last card
          setUserAnswer('');
        }, 2000);

      } catch (err) {
        console.error('Failed to save test result:', err);
        setError(err instanceof Error ? err.message : 'Failed to save test result');
        // Even if saving fails, we should still show the test complete screen
        setTimeout(() => {
          setTestComplete(true);
          setCurrentCardIndex(activeCards.length);
          setUserAnswer('');
        }, 2000);
      }
    } else {
      // Not the last card - show correct answer for 2 seconds then move to next card
      setTimeout(() => {
        setShowInfo({ person: false, action: false, object: false });
        setCurrentCardIndex(prev => prev + 1);
        setUserAnswer('');
      }, 2000);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const saveTestResult = async () => {
    try {
      const testData = {
        date: new Date(),
        totalTime: timer.seconds,
        totalCards: activeCards.length,
        wrongAnswers: wrongAnswers.map(wrong => ({
          cardname: wrong.card.cardname,
          userAnswer: wrong.answer || '',
          correctAnswer: wrong.card.person_name || ''
        })),
        settings: {
          selectedSuit,
          chunkSize
        }
      };

      console.log('Saving test result:', testData);
      const response = await fetch('/api/test-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });

      const responseText = await response.text();
      console.log('Raw test results response:', responseText);

      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log('Parsed test results response:', responseData);
      } catch (e) {
        console.error('Failed to parse test results response:', e);
        throw new Error('Invalid JSON response from server');
      }

      if (!response.ok) {
        throw new Error(responseData.error || responseData.details || `HTTP error! status: ${response.status}`);
      }

      console.log('Test result saved successfully:', responseData);
      await fetchTestHistory();
      
      // After successful save, reset the state
      shuffleCards();
      setTestComplete(false);
    } catch (err) {
      console.error('Failed to save test result:', err);
      setError(err instanceof Error ? err.message : 'Failed to save test result');
    }
  };

  const testSaveWrongCard = async () => {
    const testWrongCard = {
      cardname: "ace_of_hearts",
      person_name: "Alice",
      action_name: "jumping",
      object_name: "rope",
      userAnswer: "Bob",
      lastMistakeDate: new Date().toISOString()  // Ensure date is serializable
    };

    console.log('Testing wrong card save with data:', testWrongCard);
    
    try {
      const response = await fetch('/api/wrong-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testWrongCard)
      });

      console.log('Wrong card test API response status:', response.status);
      const responseText = await response.text(); // Get raw response text first
      console.log('Raw response:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Parsed response data:', data);
      } catch (e) {
        console.error('Failed to parse response as JSON:', e);
        alert('Server response was not valid JSON: ' + responseText);
        return;
      }

      if (!response.ok) {
        console.error('Server error response:', data);
        throw new Error(data.error || data.message || 'Failed to save test wrong card');
      }

      // Check if we got back the saved document
      if (data._id) {
        console.log('Successfully saved wrong card with ID:', data._id);
        alert('Successfully saved wrong card with ID: ' + data._id);
        
        // Verify it exists by fetching wrong cards
        await fetchWrongCards();
      } else {
        console.warn('No _id in response:', data);
        alert('Card may not have been saved properly - no ID returned');
      }
    } catch (err) {
      console.error('Error saving test wrong card:', err);
      alert('Failed to save test wrong card: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const testSaveTestResult = async () => {
    const testResult = {
      date: new Date(),
      totalTime: 60,
      totalCards: 5,
      wrongAnswers: [{
        cardname: "ace_of_hearts",
        userAnswer: "Bob",  // Making sure this field exists
        correctAnswer: "Alice"
      }],
      settings: {
        selectedSuit: "hearts",
        chunkSize: 5
      }
    };

    console.log('Testing test result save with data:', testResult);
    
    try {
      const response = await fetch('/api/test-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testResult)
      });

      console.log('Test result API response status:', response.status);
      const data = await response.json();
      console.log('Test result API response:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save test result');
      }
      
      alert('Successfully saved test result!');
    } catch (err) {
      console.error('Error saving test result:', err);
      alert('Failed to save test result: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  useEffect(() => {
    console.log('Current cards state:', cards);
    console.log('Current active cards:', activeCards);
  }, [cards, activeCards]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-pulse text-gray-600">Loading...</div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-red-500 bg-red-50 px-6 py-4 rounded-lg border border-red-200">{error}</div>
    </div>
  );

  const currentCard = currentCardIndex >= 0 && currentCardIndex < activeCards.length ? activeCards[currentCardIndex] : null;

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'bg-black-600 text-gray-100' : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section with Theme Toggle */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <h1 className={`text-3xl font-semibold ${
                isDarkMode ? 'text-gray-100' : 'text-gray-900'
              }`}>Card Memorizer</h1>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`p-2 rounded-full transition-colors duration-200 ${
                    isDarkMode 
                      ? 'bg-amber-500 hover:bg-amber-600 text-black' 
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                  aria-label="Toggle theme"
                >
                  {isDarkMode ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={seedCards}
                  className={`inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium transition-colors duration-200 ${
                    isDarkMode
                      ? 'border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700'
                      : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                  }`}
                >
                  Reset Cards
                </button>
                <button
                  onClick={shuffleCards}
                  className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium transition-colors duration-200 ${
                    isDarkMode
                      ? 'bg-amber-500 hover:bg-amber-600 text-black'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  Shuffle
                </button>
              </div>
            </div>
          </div>

          {/* Controls Section */}
          <div className={`rounded-lg shadow-sm p-6 mb-8 transition-colors duration-200 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select 
                value={practiceMode === 'wrong' ? 'wrong' : (selectedSuit || '')}
                onChange={(e) => {
                  if (e.target.value === 'wrong') {
                    console.log('Switching to wrong cards mode. Available wrong cards:', wrongCards.length);
                    setPracticeMode('wrong');
                    setSelectedSuit(null);
                    // Refresh wrong cards when switching to wrong cards mode
                    fetchWrongCards();
                  } else {
                    setPracticeMode('all');
                    setSelectedSuit(e.target.value || null);
                  }
                }}
                className={`block w-full pl-3 pr-10 py-2 text-base rounded-md transition-colors duration-200 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-amber-500 focus:border-amber-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
                }`}
              >
                <option value="">All Cards</option>
                <option value="wrong">Wrong Cards Only ({wrongCards?.length || 0})</option>
                <optgroup label="Suits">
                  <option value="hearts">Hearts</option>
                  <option value="diamonds">Diamonds</option>
                  <option value="spades">Spades</option>
                  <option value="clubs">Clubs</option>
                </optgroup>
              </select>

              <select 
                value={chunkSize} 
                onChange={(e) => setChunkSize(Number(e.target.value))}
                disabled={practiceMode === 'wrong'}
                className={`block w-full pl-3 pr-10 py-2 text-base rounded-md transition-colors duration-200 ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-amber-500 focus:border-amber-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
                } ${practiceMode === 'wrong' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <option value={52}>Full Deck (52 Cards)</option>
                <option value={20}>20 Cards</option>
                <option value={15}>15 Cards</option>
                <option value={10}>10 Cards</option>
                <option value={5}>5 Cards</option>
                <option value={2}>2 Cards</option>
              </select>
            </div>
          </div>

          {/* Main Content */}
          {currentCardIndex === -1 ? (
            <div className={`rounded-lg shadow-sm p-8 text-center transition-colors duration-200 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <button
                onClick={startTest}
                className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm transition-colors duration-200 ${
                  isDarkMode
                    ? 'bg-amber-500 hover:bg-amber-600 text-black'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                Start Test
              </button>
            </div>
          ) : currentCardIndex < activeCards.length ? (
            <div className={`rounded-lg shadow-sm p-6 space-y-6 transition-colors duration-200 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Progress: {currentCardIndex + 1} / {activeCards.length} cards</span>
                  <span className="font-mono">{formatTime(timer.seconds)}</span>
                </div>
                <div className={`w-full rounded-full h-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isDarkMode ? 'bg-amber-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${(currentCardIndex + 1) / activeCards.length * 100}%` }}
                  />
                </div>
              </div>

              {/* Card Display */}
              <div className="relative w-full max-w-[150px] aspect-[3/4] mx-auto rounded-lg shadow-lg overflow-hidden">
                <Image
                  src={`/images/${activeCards[currentCardIndex].cardname}.png`}
                  alt={activeCards[currentCardIndex].cardname.replace(/_/g, ' ')}
                  fill
                  className="object-contain"
                  sizes="150px"
                />
              </div>

              {/* Info Display */}
              <div className="space-y-2 text-center">
                {['person', 'action', 'object'].map((type) => (
                  showInfo[type as keyof typeof showInfo] && currentCard && (
                    <div key={type} className={`text-lg py-2 px-4 rounded-md inline-block ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}:{' '}
                      <span className="font-medium">
                        {currentCard[`${type}_name` as keyof ICard]}
                      </span>
                    </div>
                  )
                ))}
              </div>

              {/* Info Buttons */}
              <div className="flex justify-center gap-3">
                {['person', 'action', 'object'].map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleInfo(type as 'person' | 'action' | 'object')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      showInfo[type as keyof typeof showInfo]
                        ? isDarkMode
                          ? 'bg-amber-500 text-black'
                          : 'bg-blue-100 text-blue-700'
                        : isDarkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Show {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>

              {/* Answer Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Enter the person's name"
                  className={`block w-full px-4 py-2 rounded-md shadow-sm transition-colors duration-200 ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-gray-100 focus:ring-amber-500 focus:border-amber-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  autoComplete="off"
                />
                <div className="text-center">
                  <button
                    type="submit"
                    className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm transition-colors duration-200 ${
                      isDarkMode
                        ? 'bg-amber-500 hover:bg-amber-600 text-black'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    Next Card
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className={`rounded-lg shadow-sm p-8 space-y-6 transition-colors duration-200 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              {/* Test Complete Content */}
              <div className="text-center">
                <h2 className={`text-2xl font-semibold mb-2 ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-900'
                }`}>Test Complete!</h2>
                <div className="space-y-2">
                  <p>Time: {formatTime(timer.seconds)}</p>
                  <p>Total Cards: {activeCards.length}</p>
                  <p>Right Answers: {activeCards.length - wrongAnswers.length}</p>
                  <p>Wrong Answers: {wrongAnswers.length}</p>
                  <p>Score: {((activeCards.length - wrongAnswers.length) / activeCards.length * 100).toFixed(1)}%</p>
                </div>
              </div>

              {wrongAnswers.length > 0 && (
                <div className="mt-6">
                  <h3 className={`text-lg font-medium mb-4 ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>Mistakes:</h3>
                  <div className={`rounded-lg p-4 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <ul className="space-y-2">
                      {wrongAnswers.map((wrong, index) => (
                        <li key={index} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                          <span className={`font-medium ${
                            isDarkMode ? 'text-gray-100' : 'text-gray-900'
                          }`}>
                            {wrong.card.cardname.replace(/_/g, ' ')}
                          </span>
                          : You said &quot;{wrong.answer}&quot; but it was &quot;{wrong.card.person_name}&quot;
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="text-center">
                <button
                  onClick={() => {
                    shuffleCards();
                  }}
                  className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm transition-colors duration-200 ${
                    isDarkMode
                      ? 'bg-amber-500 hover:bg-amber-600 text-black'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  Try Again
                </button>
              </div>

              {testHistory.length > 0 && (
                <div className="mt-8">
                  <h3 className={`text-lg font-medium mb-4 ${
                    isDarkMode ? 'text-gray-100' : 'text-gray-900'
                  }`}>Recent Tests</h3>
                  <div className="space-y-3">
                    {testHistory.map((test, index) => (
                      <div key={index} className={`rounded-lg p-4 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                      }`}>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <p>Date: <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>
                            {new Date(test.date).toLocaleDateString()}
                          </span></p>
                          <p>Time: <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>
                            {formatTime(test.totalTime)}
                          </span></p>
                          <p>Total Cards: <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>
                            {test.totalCards}
                          </span></p>
                          <p>Right: <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>
                            {test.rightAnswers || test.totalCards - test.wrongAnswers.length}
                          </span></p>
                          <p>Wrong: <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>
                            {test.wrongAnswers.length}
                          </span></p>
                          <p>Score: <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>
                            {test.score || ((test.totalCards - test.wrongAnswers.length) / test.totalCards * 100).toFixed(1)}%
                          </span></p>
                          {test.settings.selectedSuit && (
                            <p className="col-span-2">
                              Suit: <span className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>
                                {test.settings.selectedSuit}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 