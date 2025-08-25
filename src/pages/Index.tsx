import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [formData, setFormData] = useState({
    parentName: '',
    childName: '',
    age: ''
  });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const sampleImages = [
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1494790108755-2616c6d53499?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=200&fit=crop'
  ];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    }
  };

  const shareToMessenger = (platform: 'telegram' | 'whatsapp') => {
    const message = `IMPERIA Промо - Новый лид:
Родитель: ${formData.parentName}
Ребенок: ${formData.childName}
Возраст: ${formData.age}`;
    
    if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(message)}`);
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (!isRecording && !recordedVideo) {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Step 1: Welcome */}
      {currentStep === 1 && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
          <div className="text-center space-y-8 max-w-md">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold text-primary tracking-tight">
                IMPERIA
              </h1>
              <p className="text-2xl text-muted-foreground font-light">
                промо
              </p>
            </div>
            
            <Button 
              onClick={() => setCurrentStep(2)}
              size="lg"
              className="w-full text-lg py-6 animate-scale-in"
            >
              <Icon name="Plus" className="mr-2" size={20} />
              новый лид
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Image Selection */}
      {currentStep === 2 && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
          <div className="w-full max-w-2xl space-y-8">
            <h2 className="text-3xl font-bold text-center text-primary">
              выберите QR
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              {sampleImages.map((image, index) => (
                <Card 
                  key={index}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedImage === image ? 'ring-2 ring-primary scale-105' : 'hover:scale-102'
                  }`}
                  onClick={() => setSelectedImage(image)}
                >
                  <CardContent className="p-4">
                    <img 
                      src={image} 
                      alt={`QR ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {selectedImage && (
              <Button 
                onClick={() => setCurrentStep(3)}
                size="lg"
                className="w-full animate-scale-in"
              >
                <Icon name="ArrowRight" className="mr-2" size={20} />
                далее
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Form and Video */}
      {currentStep === 3 && (
        <div className="min-h-screen p-4 animate-fade-in">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
              
              {/* Selected Image */}
              <Card className="flex items-center justify-center">
                <CardContent className="p-6">
                  {selectedImage && (
                    <img 
                      src={selectedImage} 
                      alt="Выбранный QR"
                      className="w-full max-w-xs object-cover rounded"
                    />
                  )}
                </CardContent>
              </Card>

              {/* Form */}
              <Card>
                <CardContent className="p-6 space-y-6">
                  <h3 className="text-xl font-semibold text-center">Анкета</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="parentName">Имя родителя</Label>
                      <Input
                        id="parentName"
                        value={formData.parentName}
                        onChange={(e) => handleInputChange('parentName', e.target.value)}
                        disabled={isRecording || !!recordedVideo}
                        className={isRecording || recordedVideo ? 'opacity-50' : ''}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="childName">Имя ребенка</Label>
                      <Input
                        id="childName"
                        value={formData.childName}
                        onChange={(e) => handleInputChange('childName', e.target.value)}
                        disabled={isRecording || !!recordedVideo}
                        className={isRecording || recordedVideo ? 'opacity-50' : ''}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="age">Возраст</Label>
                      <Input
                        id="age"
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        disabled={isRecording || !!recordedVideo}
                        className={isRecording || recordedVideo ? 'opacity-50' : ''}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Video Recording */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-center">
                    контроль качества
                  </h3>
                  
                  <div className="aspect-video bg-gray-100 rounded flex items-center justify-center">
                    <video 
                      ref={videoRef}
                      autoPlay
                      muted
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    {!isRecording && !recordedVideo ? (
                      <Button 
                        onClick={startRecording}
                        className="flex-1"
                        variant="destructive"
                      >
                        <Icon name="Video" className="mr-2" size={16} />
                        Записать
                      </Button>
                    ) : isRecording ? (
                      <Button 
                        onClick={stopRecording}
                        className="flex-1"
                        variant="destructive"
                      >
                        <Icon name="Square" className="mr-2" size={16} />
                        Стоп
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => setCurrentStep(4)}
                        className="flex-1"
                      >
                        <Icon name="ArrowRight" className="mr-2" size={16} />
                        Далее
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Share */}
      {currentStep === 4 && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center space-y-4">
              <Icon name="CheckCircle" size={64} className="mx-auto text-green-500" />
              <h2 className="text-3xl font-bold text-primary">
                Готово!
              </h2>
              <p className="text-muted-foreground">
                Отправьте данные в мессенджер
              </p>
            </div>
            
            <div className="space-y-4">
              <Button 
                onClick={() => shareToMessenger('telegram')}
                size="lg"
                variant="outline"
                className="w-full"
              >
                <Icon name="Send" className="mr-2" size={20} />
                Отправить в Telegram
              </Button>
              
              <Button 
                onClick={() => shareToMessenger('whatsapp')}
                size="lg"
                variant="outline"
                className="w-full"
              >
                <Icon name="MessageCircle" className="mr-2" size={20} />
                Отправить в WhatsApp
              </Button>
            </div>
            
            <Button 
              onClick={() => {
                setCurrentStep(1);
                setSelectedImage('');
                setRecordedVideo(null);
                setFormData({ parentName: '', childName: '', age: '' });
              }}
              variant="ghost"
              className="w-full"
            >
              Создать новый лид
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;