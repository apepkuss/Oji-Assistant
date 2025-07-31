#!/bin/bash

echo "🔍 Testing AI Service Connection..."

# Test if the AI service is running
echo "📡 Checking if AI service is running on port 9068..."
if curl -s http://localhost:9068 > /dev/null 2>&1; then
    echo "✅ AI service is responding on port 9068"
else
    echo "❌ AI service is not responding on port 9068"
    echo "💡 Trying to start a simple test server..."

    # Create a simple test response
    cat > /tmp/test_ai_response.json << 'EOF'
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "Hello! I'm a test AI assistant. The connection is working correctly!"
      }
    }
  ]
}
EOF

    echo "🧪 You can test with a simple HTTP server:"
    echo "python3 -m http.server 9068 --directory /tmp"
    echo ""
    echo "Or start your actual AI service on port 9068"
fi

echo ""
echo "🔧 Oji Configuration:"
echo "- Default Base URL: http://localhost:9068/v1"
echo "- Expected endpoint: http://localhost:9068/v1/chat/completions"
echo ""
echo "📋 To test Oji:"
echo "1. Ensure your AI service is running on port 9068"
echo "2. Open Oji app"
echo "3. Go to Settings → Server tab"
echo "4. Verify Base URL is set to: http://localhost:9068/v1"
echo "5. Send a test message"
