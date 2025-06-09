package com.recipita.service;

import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.Tesseract;

import net.sourceforge.tess4j.TesseractException;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

@Service
public class OcrService {

    public String extractText(File imageFile) {
        try {
            BufferedImage img = ImageIO.read(imageFile);

            // グレースケール化
            BufferedImage gray = new BufferedImage(img.getWidth(), img.getHeight(), BufferedImage.TYPE_BYTE_GRAY);
            Graphics2D g = gray.createGraphics();
            g.drawImage(img, 0, 0, null);
            g.dispose();

            ITesseract tesseract = new Tesseract();
            tesseract.setDatapath("/opt/homebrew/Cellar/tesseract-lang/4.1.0/share/tessdata");
            tesseract.setLanguage("jpn+eng+osd");

            String text = tesseract.doOCR(gray);
            System.out.println("=== OCR結果 ===");
            System.out.println(text);
            return text;

        } catch (IOException | TesseractException e) {
            return "OCR error: " + e.getMessage();
        }

    }
}
