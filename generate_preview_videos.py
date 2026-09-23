import os
import math
from PIL import Image, ImageDraw, ImageFont
from moviepy import *
import numpy as np

# Configuration
W, H = 1080, 1920
FPS = 30
DURATION = 5.0
LOGO_PATH = "./amide_hayimanot_zimare/assets/images/logo.jpeg"
FONT_PATH = "/usr/share/fonts/noto/NotoSansEthiopic-Bold.ttf"
TEXT = "እኛ ግን ለጸሎትና ቃሉን ለማገልገል እንተጋለን።\n— ሐዋርያት 6፥4"
BG_COLOR = (0, 0, 0) # Black

def create_text_image(text, font_path, font_size=60, image_size=(W, 400)):
    # Create an image with transparent background
    img = Image.new('RGBA', image_size, (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    
    try:
        font = ImageFont.truetype(font_path, font_size)
    except IOError:
        font = ImageFont.load_default()
        print("Warning: Custom font not found. Using default.")

    # Calculate text bounding box
    bbox = draw.multiline_textbbox((0,0), text, font=font, align="center")
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    
    # Draw centered text
    x = (image_size[0] - text_w) / 2
    y = (image_size[1] - text_h) / 2
    draw.multiline_text((x, y), text, font=font, fill=(255, 255, 255, 255), align="center")
    
    return np.array(img)

def get_base_clips():
    # Background clip
    bg_clip = ColorClip(size=(W, H), color=BG_COLOR, duration=DURATION)
    
    # Text clip
    text_img = create_text_image(TEXT, FONT_PATH, font_size=50)
    text_clip = ImageClip(text_img, is_mask=False).with_duration(DURATION)
    
    # Position text at the bottom
    text_clip = text_clip.with_position(('center', H - 500))
    
    # Logo clip
    logo_clip = ImageClip(LOGO_PATH).with_duration(DURATION)
    # Resize logo to fit nicely
    logo_w, logo_h = logo_clip.size
    max_logo_w = 800
    if logo_w > max_logo_w:
        logo_clip = logo_clip.resized(width=max_logo_w)
    
    return bg_clip, text_clip, logo_clip

# 1. Fade In/Out
def create_fade():
    bg_clip, text_clip, logo_clip = get_base_clips()
    
    logo_clip = logo_clip.with_position('center').with_effects([vfx.FadeIn(1.0), vfx.FadeOut(1.0)])
    text_clip = text_clip.with_effects([vfx.FadeIn(1.5), vfx.FadeOut(1.0)])
    
    video = CompositeVideoClip([bg_clip, logo_clip, text_clip])
    video.write_videofile("video_1_fade.mp4", fps=FPS, codec="libx264")

# 2. Zoom In
def create_zoom():
    bg_clip, text_clip, logo_clip = get_base_clips()
    
    def zoom(t):
        # Scale from 0.5 to 1.0 over 3 seconds
        scale = min(1.0, 0.5 + 0.5 * (t / 3.0))
        return scale
    
    # moviepy 2.x resizing over time can be done via Margin or transform.
    # Alternatively, use a simple resize effect if available, or custom transform.
    # For simplicity, we'll use a transform function
    
    def get_zoom_frame(get_frame, t):
        frame = get_frame(t)
        scale = min(1.2, 0.8 + 0.4 * (t / DURATION))
        # We need a PIL image to resize easily without moviepy resize bugs
        pil_img = Image.fromarray(frame)
        new_size = (int(pil_img.width * scale), int(pil_img.height * scale))
        pil_img = pil_img.resize(new_size, Image.Resampling.LANCZOS)
        return np.array(pil_img)
        
    logo_zoomed = logo_clip.transform(get_zoom_frame).with_position('center')
    
    video = CompositeVideoClip([bg_clip, logo_zoomed, text_clip])
    video.write_videofile("video_2_zoom.mp4", fps=FPS, codec="libx264")

# 3. Slide Up
def create_slide():
    bg_clip, text_clip, logo_clip = get_base_clips()
    
    def slide_pos(t):
        # Start below screen, move to center over 1.5 seconds
        start_y = H
        end_y = (H - logo_clip.h) / 2
        
        if t < 1.5:
            # Ease out
            progress = t / 1.5
            current_y = start_y - (start_y - end_y) * (1 - (1-progress)**3)
            return 'center', current_y
        return 'center', end_y

    logo_clip = logo_clip.with_position(slide_pos)
    text_clip = text_clip.with_effects([vfx.FadeIn(1.5)])
    
    video = CompositeVideoClip([bg_clip, logo_clip, text_clip])
    video.write_videofile("video_3_slide.mp4", fps=FPS, codec="libx264")

# 4. Spin / Rotate
def create_spin():
    bg_clip, text_clip, logo_clip = get_base_clips()
    
    # We use PIL for rotation to avoid moviepy rotate missing dependencies (like ImageMagick or similar)
    def rotate_frame(get_frame, t):
        frame = get_frame(t)
        pil_img = Image.fromarray(frame)
        if t < 1.5:
            # Rotate 360 degrees over 1.5 seconds
            angle = 360 * (1 - t / 1.5)
            pil_img = pil_img.rotate(angle, resample=Image.Resampling.BICUBIC, expand=False)
        return np.array(pil_img)
    
    logo_rotated = logo_clip.transform(rotate_frame).with_position('center')
    logo_rotated = logo_rotated.with_effects([vfx.FadeIn(0.5)])
    
    video = CompositeVideoClip([bg_clip, logo_rotated, text_clip])
    video.write_videofile("video_4_spin.mp4", fps=FPS, codec="libx264")

# 5. Pulse
def create_pulse():
    bg_clip, text_clip, logo_clip = get_base_clips()
    
    def pulse_frame(get_frame, t):
        frame = get_frame(t)
        pil_img = Image.fromarray(frame)
        # Pulse between 0.95 and 1.05 scale based on sine wave
        scale = 1.0 + 0.05 * math.sin(t * math.pi * 2) # 1 pulse per second
        new_size = (int(pil_img.width * scale), int(pil_img.height * scale))
        pil_img = pil_img.resize(new_size, Image.Resampling.LANCZOS)
        return np.array(pil_img)
        
    logo_pulsed = logo_clip.transform(pulse_frame).with_position('center')
    
    video = CompositeVideoClip([bg_clip, logo_pulsed, text_clip])
    video.write_videofile("video_5_pulse.mp4", fps=FPS, codec="libx264")

if __name__ == "__main__":
    print("Generating Video 1 (Fade)...")
    create_fade()
    print("Generating Video 2 (Zoom)...")
    create_zoom()
    print("Generating Video 3 (Slide)...")
    create_slide()
    print("Generating Video 4 (Spin)...")
    create_spin()
    print("Generating Video 5 (Pulse)...")
    create_pulse()
    print("All videos generated successfully.")
