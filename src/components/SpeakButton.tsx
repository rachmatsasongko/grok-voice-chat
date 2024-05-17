'use client';

// Import necessary modules and components
import { useEffect, useState, useRef } from 'react';
import { useKeyboardKey } from '@/hooks/useKeyboardKey';
import { BsFillMicFill, BsFillMicMuteFill } from 'react-icons/bs';
import { FaPause } from 'react-icons/fa';
import { ConvaiClient } from 'convai-web-sdk';

// Declare a global interface to add the webkitSpeechRecognition property to the Window object
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

const apiKey = process.env.NEXT_PUBLIC_CONVAI_API_KEY;
if (!apiKey) throw 'Please provide CONVAI_API_KEY to environment.';
let text = '';

// Export the MicrophoneComponent function component
export const SpeakButton = () => {
  // State variables to manage recording status, completion, and transcript
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const convaiClient = new ConvaiClient({
    apiKey,
    characterId: '8565e00c-146e-11ef-91e3-42010a7be00e',
    enableAudio: false,
    sessionId: '-1',
    speaker: '',
    speakerId: ''
  });

  const fetchApi = (text: string) => {
    const fetchData = async () => {
      const speech = await fetch('/api/speech', {
        method: 'post',
        body: JSON.stringify({
          text
        })
      });
      const data = await speech.json();
      const audio = new Audio(`./audio/${data.fileName}`);
      audio.play();
    }
    fetchData().catch(console.error);
  }

  convaiClient.setResponseCallback((response) => {
    // live transcript, only available during audio mode.
    if (response.hasAudioResponse()) {
      const audioResponse = response?.getAudioResponse();
      if (audioResponse.array.length === 3) {
        text += audioResponse.array[2];
      } else if (audioResponse.array.length === 4) {
        text += audioResponse.array[2];
        let fullText = text;
        text = '';
        fetchApi(fullText);
      }
    }
  });

  useKeyboardKey({
    key: ' ',
    onKeyPressed: () => {
      if (!isRecording && !isMuted) {
        startRecording();
      }
    },
  });

  // Reference to store the SpeechRecognition instance
  const recognitionRef = useRef<any>(null);

  // Function to start recording
  const startRecording = () => {
    let currentTimeout: NodeJS.Timeout;
    setIsRecording(true);
    // Create a new SpeechRecognition instance and configure it
    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    // Event handler for speech recognition results
    recognitionRef.current.onresult = (event: any) => {
      // clear timeout if there is new transcript
      if (currentTimeout) clearTimeout(currentTimeout);
      const { transcript } = event.results[event.results.length - 1][0];

      // Log the recognition results and update the transcript state
      console.log(event.results);
      // console.log(transcript);

      // set timeout for 1 second
      currentTimeout = setTimeout(() => {
        console.log('Full transcript', transcript);
        convaiClient.sendTextChunk(transcript);
        stopRecording();
      }, 1000);
    };

    // Start the speech recognition
    recognitionRef.current.start();
  };

  // Cleanup effect when the component unmounts
  useEffect(() => {
    return () => {
      // Stop the speech recognition if it's active
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Function to stop recording
  const stopRecording = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      // Stop the speech recognition and mark recording as complete
      recognitionRef.current.stop();
    }
  };

  // Render the microphone component with appropriate UI based on recording state
  return (
    <div className='flex items-center w-full'>
      {isRecording ? (
        // Button for stopping recording
        <button
          className='mt-10 m-auto flex items-center justify-center bg-red-400 hover:bg-red-500 rounded-full w-40 h-40 focus:outline-none'
        >
          <FaPause size={40} />
        </button>
      ) : isMuted ? (
        // Button for listening audio
        <button
          className='mt-10 m-auto flex items-center justify-center bg-gray-400 hover:bg-gray-500 rounded-full w-40 h-40 focus:outline-none'
        >
          <BsFillMicMuteFill size={40} />
        </button>
      ) : (
        // Button for starting recording
        <button
          className='mt-10 m-auto flex items-center justify-center bg-gray-400 hover:bg-gray-500 rounded-full w-40 h-40 focus:outline-none'
        >
          <BsFillMicFill size={40} />
        </button>
      )}
    </div>
  );
}
