// DOM Elements
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const convertBtn = document.getElementById('convertBtn');
const copyBtn = document.getElementById('copyBtn');
const loading = document.getElementById('loading');
const targetBtns = document.querySelectorAll('.target-btn');

// API Configuration
// 로컬 테스트 시에는 http://localhost:8000 사용, 배포 시에는 상대 경로 사용 가능
const API_BASE = window.location.origin; 

let currentTarget = 'team'; // Default target

/**
 * 수신 대상 버튼 클릭 이벤트 처리
 */
targetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // 기존 active 제거
        targetBtns.forEach(b => b.classList.remove('active'));
        // 현재 버튼 active 추가
        btn.classList.add('active');
        currentTarget = btn.dataset.target;
    });
});

/**
 * 말투 변환 API 호출
 */
async function convertTone() {
    const text = inputText.value.trim();

    if (!text) {
        alert('변환할 내용을 입력해주세요.');
        return;
    }

    // UI 상태: 로딩 시작
    setLoading(true);
    outputText.value = '';

    try {
        const response = await fetch(`${API_BASE}/api/convert`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                target_audience: currentTarget
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || '변환 중 오류가 발생했습니다.');
        }

        const data = await response.json();
        outputText.value = data.converted_text;
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || '서버와의 통신에 실패했습니다.');
    } finally {
        // UI 상태: 로딩 종료
        setLoading(false);
    }
}

/**
 * 로딩 상태 UI 제어
 */
function setLoading(isLoading) {
    if (isLoading) {
        loading.classList.remove('hidden');
        convertBtn.disabled = true;
        convertBtn.textContent = '변환 중...';
    } else {
        loading.classList.add('hidden');
        convertBtn.disabled = false;
        convertBtn.textContent = '변환하기';
    }
}

/**
 * 결과 텍스트를 클립보드에 복사
 */
async function copyToClipboard() {
    const text = outputText.value;
    
    if (!text) {
        alert('복사할 내용이 없습니다.');
        return;
    }

    try {
        await navigator.clipboard.writeText(text);
        
        // 버튼 피드백
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '복사 완료!';
        copyBtn.style.backgroundColor = '#dcfce7'; // Light green
        copyBtn.style.borderColor = '#22c55e'; // Green
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.backgroundColor = '';
            copyBtn.style.borderColor = '';
        }, 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
        alert('클립보드 복사에 실패했습니다.');
    }
}

// Event Listeners
convertBtn.addEventListener('click', convertTone);
copyBtn.addEventListener('click', copyToClipboard);
