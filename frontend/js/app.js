// app.js
const API_BASE = window.location.origin; // 로컬 테스트 및 배포 시 동일 도메인 사용

document.addEventListener("DOMContentLoaded", () => {
    const targetButtons = document.querySelectorAll(".target-btn");
    const convertBtn = document.getElementById("convertBtn");
    const copyBtn = document.getElementById("copyBtn");
    const inputText = document.getElementById("inputText");
    const outputText = document.getElementById("outputText");
    const loading = document.getElementById("loading");

    // 수신 대상 버튼 클릭 이벤트
    targetButtons.forEach(button => {
        button.addEventListener("click", () => {
            targetButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
        });
    });

    // 변환하기 버튼 클릭 이벤트
    convertBtn.addEventListener("click", async () => {
        const text = inputText.value.trim();
        const activeBtn = document.querySelector(".target-btn.active");
        const target = activeBtn ? activeBtn.dataset.target : null;

        if (!text) {
            alert("변환할 내용을 입력해주세요.");
            inputText.focus();
            return;
        }

        if (!target) {
            alert("수신 대상을 선택해주세요.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE}/api/convert`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text: text,
                    target_audience: target
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "변환 중 오류가 발생했습니다.");
            }

            const data = await response.json();
            outputText.value = data.converted_text;
        } catch (error) {
            console.error("Error:", error);
            alert(`오류: ${error.message}`);
        } finally {
            setLoading(false);
        }
    });

    // 복사하기 버튼 클릭 이벤트
    copyBtn.addEventListener("click", () => {
        const text = outputText.value;
        if (!text) {
            alert("복사할 내용이 없습니다.");
            return;
        }

        navigator.clipboard.writeText(text).then(() => {
            const originalText = copyBtn.innerText;
            copyBtn.innerText = "복사 완료! ✅";
            copyBtn.style.backgroundColor = "#10b981"; // 초록색으로 변경

            setTimeout(() => {
                copyBtn.innerText = originalText;
                copyBtn.style.backgroundColor = ""; // 원래 색상으로 복구
            }, 2000);
        }).catch(err => {
            console.error("복사 실패:", err);
            alert("클립보드 복사에 실패했습니다.");
        });
    });

    // 로딩 상태 제어 함수
    function setLoading(isLoading) {
        if (isLoading) {
            loading.classList.remove("hidden");
            convertBtn.disabled = true;
            convertBtn.innerText = "변환 중...";
        } else {
            loading.classList.add("hidden");
            convertBtn.disabled = false;
            convertBtn.innerText = "변환하기";
        }
    }
});
