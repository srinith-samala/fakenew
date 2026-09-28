const SAMPLES = {
    real: "NASA's James Webb Space Telescope has captured new high-resolution images of distant galaxies, providing astrophysicists with critical data regarding early universe formation and star evolution.",
    fake: "SHOCKING SECRET: Scientists discover miracle alien herb that cures all diseases overnight! Government agencies banned this breakdown truth proof!"
};

function loadSample(type) {
    const input = document.getElementById("newsInput");
    input.value = SAMPLES[type] || "";
}

function clearInput() {
    document.getElementById("newsInput").value = "";
    document.getElementById("placeholderResult").classList.remove("hidden");
    document.getElementById("resultContent").classList.add("hidden");
}

async function analyzeNews() {
    const textInput = document.getElementById("newsInput").value.trim();
    if (!textInput || textInput.length < 5) {
        alert("Please enter at least 5 characters of news text to evaluate.");
        return;
    }

    const btnText = document.getElementById("btnText");
    const btnSpinner = document.getElementById("btnSpinner");
    const analyzeBtn = document.getElementById("analyzeBtn");

    // UI Loading state
    btnText.textContent = "Classifying...";
    btnSpinner.classList.remove("hidden");
    analyzeBtn.disabled = true;

    try {
        const response = await fetch("/api/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: textInput })
        });

        if (!response.ok) {
            throw new Error("Prediction API server error");
        }

        const data = await response.json();
        displayResults(data);

    } catch (err) {
        console.error("Error analyzing text:", err);
        alert("Failed to connect to ML Model backend. Please make sure python backend server is running.");
    } finally {
        btnText.textContent = "Analyze News Text";
        btnSpinner.classList.add("hidden");
        analyzeBtn.disabled = false;
    }
}

function displayResults(data) {
    const placeholder = document.getElementById("placeholderResult");
    const resultContent = document.getElementById("resultContent");
    const statusBanner = document.getElementById("statusBanner");
    const resultBadge = document.getElementById("resultBadge");
    const confidenceText = document.getElementById("confidenceText");
    const fakeProbVal = document.getElementById("fakeProbVal");
    const realProbVal = document.getElementById("realProbVal");
    const fakeBar = document.getElementById("fakeBar");
    const realBar = document.getElementById("realBar");
    const heatmapBox = document.getElementById("tokenHeatmap");

    placeholder.classList.add("hidden");
    resultContent.classList.remove("hidden");

    const isFake = data.label.includes("FAKE");
    
    // Set banner styling
    if (isFake) {
        statusBanner.className = "status-banner fake-bg";
        resultBadge.textContent = "⚠️ FAKE NEWS";
    } else {
        statusBanner.className = "status-banner real-bg";
        resultBadge.textContent = "✅ REAL NEWS";
    }

    confidenceText.textContent = `${data.confidence}% Confidence`;
    fakeProbVal.textContent = `${data.fake_probability}%`;
    realProbVal.textContent = `${data.real_probability}%`;

    // Animate bars
    fakeBar.style.width = `${data.fake_probability}%`;
    realBar.style.width = `${data.real_probability}%`;

    // Render Token Heatmap
    heatmapBox.innerHTML = "";
    if (data.tokens && data.tokens.length > 0) {
        data.tokens.forEach(t => {
            const span = document.createElement("span");
            span.className = `t-word ${t.impact}`;
            span.textContent = t.text;
            heatmapBox.appendChild(span);
        });
    } else {
        heatmapBox.textContent = "No specific suspicious triggers detected.";
    }
}
