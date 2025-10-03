import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import MarkdownRenderer from "@/utils/markdown-renderer";
import { GoogleGenAI } from "@google/genai";
import { useState, useRef, useEffect } from "react";
import { X, ImageIcon, Send } from "lucide-react";
import { SiSparkpost } from "react-icons/si";
import clsx from "clsx";
import {Spinner} from '@/pages/free-exam-pages/components/Splash.tsx'

// --- GEMINI API Setup ---
const gemini = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_KEY });

const fileToGenerativePart = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const dataUrl = reader.result;
      const base64Data = dataUrl.split(",")[1];

      resolve({
        data: base64Data,
        mimeType: file.type,
      });
    };

    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

const ask = async (text, imagePart) => {
  const contents = [];

  if (text) {
    contents.push({ text: text });
  }

  if (imagePart) {
    contents.push({
      inlineData: {
        data: imagePart.data,
        mimeType: imagePart.mimeType,
      },
    });
  }

  if (contents.length === 0) {
    throw new Error("Prompt is empty. Please enter text or upload an image.");
  }

  return await gemini.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
  });
};

// Enhanced Flutter WebView detection
const isFlutterWebView = () => {
  return !!(
    window.FlutterFileUpload || 
    window.Flutter || 
    navigator.userAgent.includes('Flutter') ||
    window.flutter_inappwebview ||
    // Additional checks for Flutter web
    window.__flutter_web__ ||
    document.querySelector('meta[name="generator"][content*="Flutter"]')
  );
};

// Enhanced Flutter bridge waiting with better timeout handling
const waitForFlutterBridge = (maxWait = 5000) => {
  return new Promise((resolve) => {
    let attempts = 0;
    const maxAttempts = maxWait / 100;
    
    const checkBridge = () => {
      // Check for any available Flutter bridge methods
      const bridgeAvailable = !!(
        window.requestFileFromFlutter || 
        window.FlutterFileUpload || 
        window.Flutter
      );
      
      if (bridgeAvailable) {
        console.log('Flutter bridge detected and ready');
        resolve(true);
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(checkBridge, 100);
      } else {
        console.warn('Flutter bridge timeout after', maxWait, 'ms');
        resolve(false);
      }
    };
    
    checkBridge();
  });
};

const BrittoAsk = () => {
  const [result, setResult] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFlutterReady, setIsFlutterReady] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");
  const fileInputRef = useRef(null);

  // Enhanced Flutter bridge setup with better error handling
  useEffect(() => {
    let bridgeReady = false;

    const setupFlutterBridge = async () => {
      const isFlutter = isFlutterWebView();
      console.log('Flutter WebView detected:', isFlutter);
      setDebugInfo(prev => prev + `Flutter detected: ${isFlutter}\n`);
      
      if (isFlutter) {
        console.log('Setting up Flutter bridge...');
        setDebugInfo(prev => prev + 'Setting up Flutter bridge...\n');
        
        // Wait for Flutter bridge to be ready
        const ready = await waitForFlutterBridge(5000); // Increased timeout
        setIsFlutterReady(ready);
        bridgeReady = ready;
        
        if (ready) {
          console.log('Flutter bridge is ready');
          setDebugInfo(prev => prev + 'Flutter bridge ready!\n');
        } else {
          console.warn('Flutter bridge not ready, falling back to regular file input');
          setDebugInfo(prev => prev + 'Flutter bridge timeout, using fallback\n');
        }
      } else {
        console.log('Running in regular web browser');
        setIsFlutterReady(false);
        setDebugInfo(prev => prev + 'Regular web browser mode\n');
      }
    };

    // Enhanced function to handle file data from Flutter with better error handling
    window.setImageFileFromFlutter = (file, previewUrl) => {
      console.log('Setting file from Flutter:', {
        name: file?.name,
        type: file?.type,
        size: file?.size,
        hasPreviewUrl: !!previewUrl
      });
      
      setDebugInfo(prev => prev + `File received: ${file?.name || 'unknown'} (${file?.size || 0} bytes)\n`);
      
      try {
        if (!file) {
          throw new Error('No file received from Flutter');
        }
        
        if (!file.type || !file.type.startsWith('image/')) {
          throw new Error('Invalid file type received from Flutter');
        }
        
        setImageFile(file);
        setImagePreview(previewUrl);
        setError(null);
        console.log('File successfully set from Flutter');
        setDebugInfo(prev => prev + 'File successfully processed!\n');
      } catch (err) {
        console.error('Error setting file from Flutter:', err);
        setError(`Error processing file: ${err.message}`);
        setDebugInfo(prev => prev + `Error: ${err.message}\n`);
      }
    };

    // Enhanced function to handle file errors from Flutter
    window.handleFileError = (errorMessage) => {
      console.error('File error from Flutter:', errorMessage);
      // setError(`Flutter file error: ${errorMessage}`);
      setDebugInfo(prev => prev + `Flutter error: ${errorMessage}\n`);
      
      // Clear any existing file state on error
      setImageFile(null);
      setImagePreview(null);
    };

    // Setup the bridge
    setupFlutterBridge();

    // Cleanup function
    return () => {
      if (bridgeReady) {
        delete window.setImageFileFromFlutter;
        delete window.handleFileError;
      }
    };
  }, []);

  const handleAsk = async () => {
    if (!content.trim() && !imageFile) {
      setError("Please enter text or upload an image.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult("");

    try {
      let imagePart = undefined;

      if (imageFile) {
        imagePart = await fileToGenerativePart(imageFile);
      }

      const res = await ask(content, imagePart);
      setResult(res.text);
      
      // Clear inputs after successful submission
      setContent("");
      setImageFile(null);
      setImagePreview(null);
      setDebugInfo(""); // Clear debug info after successful submission
    } catch (error) {
      console.error('API Error:', error);
      setError(
        "An error occurred: " + (error.message || "Failed to get response.")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      console.log('File selected via input:', file.name, file.type, file.size);
      setDebugInfo(prev => prev + `Browser file selected: ${file.name} (${file.size} bytes)\n`);
      setImageFile(file);
      setError(null);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImageFile(null);
      setImagePreview(null);
      if (e.target.value) {
        setError("Please select a valid image file (JPEG, PNG, GIF, or WEBP).");
      }
    }
    
    // Clear the input value to allow re-selecting the same file
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleUploadClick = async () => {
    const inFlutterWebView = isFlutterWebView();
    
    console.log('Upload clicked - Flutter WebView:', inFlutterWebView, 'Bridge Ready:', isFlutterReady);
    setDebugInfo(prev => prev + `Upload clicked - Flutter: ${inFlutterWebView}, Ready: ${isFlutterReady}\n`);

    if (inFlutterWebView && isFlutterReady) {
      try {
        console.log('Requesting file from Flutter...');
        setDebugInfo(prev => prev + 'Requesting file from Flutter...\n');
        
        // Try multiple Flutter bridge methods in priority order
        if (window.requestFileFromFlutter) {
          console.log('Using window.requestFileFromFlutter');
          window.requestFileFromFlutter();
        } else if (window.FlutterFileUpload) {
          console.log('Using window.FlutterFileUpload.postMessage');
          window.FlutterFileUpload.postMessage('requestFileUpload');
        } else if (window.Flutter) {
          console.log('Using window.Flutter.postMessage');
          window.Flutter.postMessage(JSON.stringify({action: 'requestFileUpload'}));
        } else {
          throw new Error('No Flutter bridge method available');
        }
        
        setDebugInfo(prev => prev + 'Flutter file request sent\n');
      } catch (err) {
        console.error('Error requesting file from Flutter:', err);
        setError(`Flutter error: ${err.message}, using browser fallback`);
        setDebugInfo(prev => prev + `Flutter error: ${err.message}, using fallback\n`);
        // Fallback to regular file input
        fileInputRef.current?.click();
      }
    } else {
      // Regular web browser or Flutter bridge not ready
      console.log('Using regular file input');
      setDebugInfo(prev => prev + 'Using browser file input\n');
      fileInputRef.current?.click();
    }
  };

  const handleRemoveImage = () => {
    console.log('Removing image');
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    
    // Cleanup preview URL to prevent memory leaks
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
  };

  // Cleanup preview URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Handle Enter key in textarea
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!loading && (content.trim() || imageFile)) {
        handleAsk();
      }
    }
  };

  return (
    <div className="max-w-4xl relative mx-auto h-11/12">
      <div className="shadow-none border-none bg-transparent">
        <div className="space-y-6">
          <div className="h-11/12 overflow-y-auto">
            {result ? (
              <div className="bg-white rounded-xl dark:bg-zinc-900 border px-2 pb-10 pt-3">
                <MarkdownRenderer content={result} />
              </div>
            ) : (
              <div className="flex justify-center items-center flex-col mt-20">
                <div className={clsx(
                  loading ? "shimmer text-pink-800" : "text-muted-foreground"
                )}>
                  <span>
                    <SiSparkpost size={'50'} />
                  </span>
                </div>
                <div className={`${loading && 'shimmer bg-gradient-to-t from-red-400 via-pink-500 to-pink-600 text-transparent bg-clip-text'} inline-block text-muted-foreground`}>
                  {loading ? "একটু অপেক্ষা করো... চিন্তা করছি!!" : "বৃত্ত সবজান্তা"}
                </div>
              </div>
            )}

            {!loading && !result && (
              <div className="text-center text-xs text-muted-foreground px-5">
                যেকোনো কিছু জিজ্ঞেস করতে পারো। তোমার বইয়ের কোনো কিছুর ছবি তুলেও জিজ্ঞেস করতে পারো...
              </div>
            )}

        
          </div>
          
          <div className="w-full left-0 bottom-17 bg-white dark:bg-zinc-800 border rounded-xl overflow-hidden fixed min-h-[70px]">
            {/* Image Preview - Bottom Left Corner */}
            {imagePreview && (
              <div className="relative group p-2 dark:bg-zinc-800">
                <div className="relative w-12">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded-lg border-2 border-white shadow-lg"
                    onError={(e) => {
                      console.error('Error loading image preview');
                      setError('Error loading image preview');
                      handleRemoveImage();
                    }}
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 bg-gray-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 opacity-100 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            )}

            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="যেকোনো কিছু জিজ্ঞেস করো..."
              className="min-h-[70px] border-none focus:border-none outline-0 shadow-none focus:outline-0 ring-0 focus:ring-0 focus-visible:ring-0 dark:bg-zinc-800"
              disabled={loading}
            />

            {/* Hidden File Input - Works in all environments */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Action Buttons */}
            <div className="flex gap-3 absolute right-1 bottom-1">
              <div>
                <Button
                  onClick={handleUploadClick}
                  variant="outline"
                  size={"icon"}
                  disabled={loading}
                  title={isFlutterWebView() && isFlutterReady ? "Upload image (Native Flutter)" : "Upload image (Browser)"}
                >
                  <ImageIcon size={18} />
                </Button>
              </div>

              <div>
                <Button
                  size={"icon"}
                  onClick={handleAsk}
                  disabled={loading || (!content.trim() && !imageFile)}
                  className="flex-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  title={loading ? "Processing..." : "Send message"}
                >
                  {loading ? (
                    <Spinner />
                  ) : (
                    <Send size={18} />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrittoAsk;