import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  CameraOff,
  Upload,
  Sparkles,
  Scan,
  RefreshCw,
  Eye,
  FileSearch,
  CheckCircle,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { api } from '../services/api';

export const VisionLab: React.FC = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisPrompt, setAnalysisPrompt] = useState('Perform comprehensive OCR, detect all visual objects, explain the layout, and extract key insights.');
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.error(err);
      setCameraError('Camera access was denied or is not available. You can upload an image file instead.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedImage(dataUrl);
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCapturedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const runAnalysis = async () => {
    if (!capturedImage) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const res = await api.analyzeVision(capturedImage, analysisPrompt, 'image/jpeg');
      setAnalysisResult(res.analysis);
    } catch (err: any) {
      setAnalysisResult(`Analysis Error: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyResult = () => {
    if (!analysisResult) return;
    navigator.clipboard.writeText(analysisResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-y-auto p-4 md:p-8">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cyan-900/40 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <Scan className="w-6 h-6 text-cyan-400" />
              <h1 className="text-xl md:text-2xl font-bold font-display text-slate-100 tracking-wider">
                COMPUTER VISION & OCR MATRIX
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Multi-modal Gemini Vision engine for real-time document OCR, object tracking, and scene cognition.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isCameraActive ? (
              <button
                onClick={startCamera}
                className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
              >
                <Camera className="w-4 h-4" />
                Activate Camera
              </button>
            ) : (
              <button
                onClick={stopCamera}
                className="px-3.5 py-2 rounded-xl bg-red-950/80 border border-red-700/60 text-red-300 text-xs flex items-center gap-1.5 transition-all"
              >
                <CameraOff className="w-4 h-4" />
                Deactivate Camera
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5 transition-all border border-slate-700"
            >
              <Upload className="w-4 h-4" />
              Upload Image
            </button>
          </div>
        </div>

        {/* Camera Permission Alert if Error */}
        {cameraError && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/60 text-xs text-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{cameraError}</span>
          </div>
        )}

        {/* Workspace: Video Feed & Image View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Input Viewport */}
          <div className="rounded-2xl bg-slate-900/80 border border-cyan-500/30 p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                OPTICAL SENSOR FEED
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {isCameraActive ? 'LIVE WEBCAM STREAM' : capturedImage ? 'STATIC FRAME READY' : 'STANDBY'}
              </span>
            </div>

            <div className="relative rounded-xl overflow-hidden bg-black/80 aspect-video flex items-center justify-center border border-slate-800">
              {isCameraActive ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {/* Cyber Scanner Reticle Overlay */}
                  <div className="absolute inset-0 pointer-events-none border-2 border-cyan-500/30 m-4 rounded-lg flex items-center justify-center">
                    <div className="w-16 h-16 border-t-2 border-l-2 border-cyan-400 absolute top-0 left-0" />
                    <div className="w-16 h-16 border-t-2 border-r-2 border-cyan-400 absolute top-0 right-0" />
                    <div className="w-16 h-16 border-b-2 border-l-2 border-cyan-400 absolute bottom-0 left-0" />
                    <div className="w-16 h-16 border-b-2 border-r-2 border-cyan-400 absolute bottom-0 right-0" />
                    <div className="w-full h-0.5 bg-cyan-400/50 shadow-lg shadow-cyan-400 animate-pulse" />
                  </div>
                </>
              ) : capturedImage ? (
                <img
                  src={capturedImage}
                  alt="Capture preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center p-6 text-slate-500 font-mono text-xs">
                  <Camera className="w-10 h-10 mx-auto text-slate-600 mb-2 opacity-50" />
                  Click "Activate Camera" or "Upload Image" to feed frames to M.K AI.
                </div>
              )}
            </div>

            {/* Hidden canvas for taking snapshot */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Viewport Control Buttons */}
            <div className="mt-4 flex items-center justify-between gap-2">
              {isCameraActive ? (
                <button
                  onClick={captureFrame}
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-500/20"
                >
                  <Scan className="w-4 h-4" />
                  CAPTURE FRAME FOR OCR & ANALYSIS
                </button>
              ) : capturedImage ? (
                <div className="flex items-center gap-2 w-full">
                  <button
                    onClick={() => setCapturedImage(null)}
                    className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-mono"
                  >
                    Discard
                  </button>
                  <button
                    onClick={runAnalysis}
                    disabled={isAnalyzing}
                    className="flex-1 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Running Cognitive Analysis...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Execute Vision Analysis
                      </>
                    )}
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          {/* Right: Cognitive Analysis Results */}
          <div className="rounded-2xl bg-slate-900/80 border border-cyan-500/30 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                  <FileSearch className="w-4 h-4" />
                  COGNITIVE OCR & SCENE SYNTHESIS
                </span>
                {analysisResult && (
                  <button
                    onClick={copyResult}
                    className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>

              {/* Directive Preset Buttons */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {[
                  'Extract all text (OCR)',
                  'Detect UI elements & buttons',
                  'Explain code snippet in photo',
                  'Identify physical objects',
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => setAnalysisPrompt(preset)}
                    className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 hover:border-cyan-500/40 text-[11px] text-slate-300 font-mono transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>

              {/* Analysis Result Display */}
              <div className="p-4 rounded-xl bg-black/80 border border-slate-800 min-h-[220px] max-h-[380px] overflow-y-auto text-xs font-mono text-slate-200 leading-relaxed whitespace-pre-wrap selection:bg-cyan-500/30">
                {analysisResult ? (
                  analysisResult
                ) : isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center py-12 text-cyan-400">
                    <RefreshCw className="w-6 h-6 animate-spin mb-2" />
                    <span>Gemini 3.8 Multimodal Tensor Analyzing Frame...</span>
                  </div>
                ) : (
                  <div className="text-slate-500 py-12 text-center">
                    Analysis results, detected text, and scene descriptions will render here.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 text-[10px] text-slate-500 font-mono flex items-center justify-between">
              <span>MODEL: GEMINI-3.8-FLASH MULTIMODAL</span>
              <span>CREATOR: MANISH MEENA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
