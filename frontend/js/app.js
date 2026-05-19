// app.js
const API_BASE = window.location.origin;

document.addEventListener("DOMContentLoaded", () => {
    const targetButtons = document.querySelectorAll(".target-btn");
    const convertBtn = document.getElementById("convertBtn");
    const copyBtn = document.getElementById("copyBtn");
    const inputText = document.getElementById("inputText");
    const outputText = document.getElementById("outputText");
    const loading = document.getElementById("loading");

    // Tailwind classes for button states
    const activeClasses = ["bg-blue-600", "text-white", "border-blue-600", "shadow-md"];
    const inactiveClasses = ["bg-transparent", "text-slate-600", "border-slate-100"];

    // Initialize buttons
    targetButtons.forEach(btn => {
        if (btn.classList.contains("active")) {
            btn.classList.add(...activeClasses);
            btn.classList.remove(...inactiveClasses);
        } else {
            btn.classList.add(...inactiveClasses);
            btn.classList.remove(...activeClasses);
        }
    });

    // 수신 대상 버튼 클릭 이벤트
    targetButtons.forEach(button => {
        button.addEventListener("click", () => {
            targetButtons.forEach(btn => {
                btn.classList.remove("active", ...activeClasses);
                btn.classList.add(...inactiveClasses);
            });
            button.classList.add("active", ...activeClasses);
            button.classList.remove(...inactiveClasses);
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
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = "<span>✅</span> 복사 완료!";
            copyBtn.classList.replace("bg-slate-100", "bg-emerald-100");
            copyBtn.classList.replace("text-slate-500", "text-emerald-600");

            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
                copyBtn.classList.replace("bg-emerald-100", "bg-slate-100");
                copyBtn.classList.replace("text-emerald-600", "text-slate-500");
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
            loading.classList.add("flex");
            convertBtn.disabled = true;
            convertBtn.innerHTML = `
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewbox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                변환 중...
            `;
        } else {
            loading.classList.add("hidden");
            loading.classList.remove("flex");
            convertBtn.disabled = false;
            convertBtn.innerText = "변환하기";
        }
    }
});
