import React, { useState } from 'react';

export const UploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    // 画像をBase64に変換
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = (reader.result as string).split(',')[1]; // Data URLの `base64部分` のみ

      try {
        const res = await fetch('http://localhost:8082/api/gemini-ocr', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ base64Image }),
        });

        const data = await res.text(); // 必要に応じて .json()
        setResponse(data);
      } catch (err) {
        console.error(err);
        setResponse("送信エラー");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <h2>レシート画像アップロード</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleChange} />
        <button type="submit">送信</button>
      </form>
      <pre>{response}</pre>
    </div>
  );
};
