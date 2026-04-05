import boto3
import json

# Khởi tạo client kết nối với dịch vụ Polly qua thư viện boto3
polly_client = boto3.client('polly', region_name='ap-southeast-1')

text_to_read = "The one natural talent I really want to improve is dancing, specifically, Vietnamese street dance styles that I’ve always felt drawn to. What it is exactly is this instinctive ability to feel the music’s groove and match my body movements to it without overthinking, like... I can freestyle a little when a good song comes on at a party or catch on to choreography faster than most of my friends."

try:
    # Gọi API chuyển đổi text thành file âm thanh
    response = polly_client.synthesize_speech(
        Text=text_to_read,
        OutputFormat='json',
        SpeechMarkTypes=['word'],
        VoiceId='Ruth', # Giọng Ruth cực kỳ hợp cho text en-US tự nhiên thế này
        Engine='neural', 
        LanguageCode='en-US' 
    )

    if "AudioStream" in response:
        # Khi OutputFormat là json, AudioStream thực chất chứa văn bản
        speech_marks_data = response["AudioStream"].read().decode('utf-8')
        
        # Lưu dữ liệu vào file txt
        with open("speech_marks.txt", "w", encoding="utf-8") as file:
            file.write(speech_marks_data)
            
        print("Đã xuất timestamp vào file speech_marks.txt thành công!")
            
except Exception as e:
    print(f"Lỗi: {e}")