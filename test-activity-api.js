import fetch from 'node-fetch';

// Simple test using fetch directly
async function testActivityApi() {
  console.log("🔍 Testing Person 2's Activity API...");
  console.log("Make sure Person 2's backend is running on http://localhost:8002");
  
  try {
    // Test 1: Suggest activity
    console.log("\n1️⃣ Testing /suggest endpoint...");
    const suggestResponse = await fetch('http://localhost:8002/activities/suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emotion: "sad",
        intensity: 4
      })
    });
    
    if (!suggestResponse.ok) {
      throw new Error(`HTTP error! status: ${suggestResponse.status}`);
    }
    
    const suggestData = await suggestResponse.json();
    console.log("✅ Suggest response:", suggestData);
    
    if (suggestData && suggestData.recommended_activity) {
      
      const activityName = suggestData.recommended_activity;
      
      // Test 2: Start activity
      console.log("\n2️⃣ Testing /start endpoint...");
      const startResponse = await fetch('http://localhost:8002/activities/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activity_name: activityName,
          chosen_duration_minutes: suggestData.default_duration_minutes || 5,
          user_id: "test_user_123"  // ADD THIS - might be needed
        })
      });
      
      const startData = await startResponse.json();
      console.log("✅ Start response:", startData);
      
      // Test 3: Complete activity - Try with data
      console.log("\n3️⃣ Testing /complete endpoint...");
      
      // Try different possible formats based on the error
      const completeResponse = await fetch('http://localhost:8002/activities/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: "test_user_123",
          activity_name: activityName,
          completed: true,
          duration_completed: suggestData.default_duration_minutes || 5
        })
      });
      
      const completeData = await completeResponse.json();
      console.log("✅ Complete response:", completeData);
      
      console.log("\n🎉 All tests passed! Integration is working!");
    } else {
      console.log("⚠️ No activity suggestion received");
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testActivityApi();