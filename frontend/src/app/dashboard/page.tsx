'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { api, getImageUrl } from '@/utils/api';
import styles from './dashboard.module.css';

interface ResizedImage {
  original: string;
  resized: string;
  width: number;
  height: number;
  format: string;
  size: number;
}

export default function Dashboard() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [quality, setQuality] = useState<string>('80');
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<ResizedImage | null>(null);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user, token, logout, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setResult(null);
      setError('');
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please select an image file');
      return;
    }

    if (!token) {
      setError('Authentication required');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const widthNum = width ? parseInt(width) : undefined;
      const heightNum = height ? parseInt(height) : undefined;
      const qualityNum = quality ? parseInt(quality) : undefined;

      const response = await api.uploadImage(selectedFile, token, widthNum, heightNum, qualityNum);
      
      if (response.success) {
        setResult(response.image);
      } else {
        setError(response.message || 'Failed to resize image');
      }
    } catch (err) {
      setError('Failed to resize image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview('');
    setResult(null);
    setError('');
    setWidth('');
    setHeight('');
    setQuality('80');
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Image Resizer</h1>
        <div className={styles.userInfo}>
          <span>Welcome, {user.name}!</span>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.card}>
          <h2>Upload and Resize Image</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="file">Select Image</label>
              <input
                type="file"
                id="file"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </div>

            {preview && (
              <div className={styles.preview}>
                <h3>Preview:</h3>
                <img src={preview} alt="Preview" />
              </div>
            )}

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="width">Width (px)</label>
                <input
                  type="number"
                  id="width"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  placeholder="Auto"
                  min="1"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="height">Height (px)</label>
                <input
                  type="number"
                  id="height"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="Auto"
                  min="1"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="quality">Quality (1-100)</label>
              <input
                type="range"
                id="quality"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                min="1"
                max="100"
              />
              <span className={styles.qualityValue}>{quality}%</span>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.submitButton} disabled={isUploading || !selectedFile}>
                {isUploading ? 'Processing...' : 'Resize Image'}
              </button>
              <button type="button" onClick={handleReset} className={styles.resetButton}>
                Reset
              </button>
            </div>
          </form>

          {result && (
            <div className={styles.result}>
              <h3>Result:</h3>
              <div className={styles.resultImages}>
                <div className={styles.resultImage}>
                  <h4>Original</h4>
                  <img src={getImageUrl(result.original)} alt="Original" />
                  <a href={getImageUrl(result.original)} download target="_blank" rel="noopener noreferrer">
                    Download Original
                  </a>
                </div>
                <div className={styles.resultImage}>
                  <h4>Resized</h4>
                  <img src={getImageUrl(result.resized)} alt="Resized" />
                  <p>
                    Dimensions: {result.width}x{result.height}px<br />
                    Format: {result.format}<br />
                    Size: {Math.round(result.size / 1024)}KB
                  </p>
                  <a href={getImageUrl(result.resized)} download target="_blank" rel="noopener noreferrer">
                    Download Resized
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
