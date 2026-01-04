const API_ENDPOINTS = [
    'https://www.tikwm.com/api/',
    'https://api.tiklydown.eu.org/api/download',
    'https://tikcdn.io/api/v1/video'
];

let currentVideoData = null;
let abortController = null; // 用于取消请求
let debounceTimer = null; // 防抖计时器

const elements = {
    videoUrl: document.getElementById('videoUrl'),
    downloadBtn: document.getElementById('downloadBtn'),
    result: document.getElementById('result'),
    error: document.getElementById('error'),
    videoTitle: document.getElementById('videoTitle'),
    videoAuthor: document.getElementById('videoAuthor'),
    contentType: document.getElementById('contentType'),
    downloadVideo: document.getElementById('downloadVideo'),
    previewBtn: document.getElementById('previewBtn'),
    copyVideoLink: document.getElementById('copyVideoLink'),
    videoOptions: document.getElementById('videoOptions'),
    photoGallery: document.getElementById('photoGallery'),
    photoGrid: document.getElementById('photoGrid'),
    previewModal: document.getElementById('previewModal'),
    previewVideo: document.getElementById('previewVideo'),
    previewSource: document.getElementById('previewSource'),
    modalClose: document.querySelector('.modal-close'),
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage'),
    main: document.querySelector('.main'),
    header: document.querySelector('.header'),
    container: document.querySelector('.container')
};

// Event Listeners
elements.downloadBtn.addEventListener('click', handleDownload);

elements.videoUrl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleDownload();
    }
});

// 清除错误状态
elements.videoUrl.addEventListener('input', () => {
    if (elements.videoUrl.classList.contains('error')) {
        hideError();
    }
});

// 粘贴自动解析
elements.videoUrl.addEventListener('paste', (e) => {
    // 清除之前的防抖计时器
    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }

    // 500ms 后自动触发解析
    debounceTimer = setTimeout(() => {
        const pastedText = e.clipboardData.getData('text');
        if (pastedText && isValidTikTokUrl(pastedText.trim())) {
            handleDownload();
        }
    }, 500);
});

elements.previewBtn?.addEventListener('click', () => {
    if (currentVideoData?.videoUrl) {
        openPreview(currentVideoData.videoUrl);
    }
});

elements.copyVideoLink?.addEventListener('click', () => {
    if (currentVideoData?.videoUrl) {
        copyToClipboard(currentVideoData.videoUrl, elements.copyVideoLink);
    }
});

elements.modalClose?.addEventListener('click', closePreview);

elements.previewModal?.addEventListener('click', (e) => {
    if (e.target === elements.previewModal || e.target.classList.contains('modal-backdrop')) {
        closePreview();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && elements.previewModal?.classList.contains('active')) {
        closePreview();
    }
});

// Main Functions
async function handleDownload() {
    const url = elements.videoUrl.value.trim();

    if (!url) {
        showError('Please enter a TikTok URL');
        return;
    }

    if (!isValidTikTokUrl(url)) {
        showError('Please enter a valid TikTok URL');
        return;
    }

    // 取消之前的请求
    if (abortController) {
        abortController.abort();
    }

    // 创建新的 AbortController
    abortController = new AbortController();

    hideError();
    hideResult();
    setLoading(true);

    try {
        const videoData = await fetchTikTokData(url);
        displayResult(videoData);
    } catch (error) {
        // 如果是用户取消的请求，不显示错误
        if (error.name === 'AbortError') {
            return;
        }
        showError(error.message || 'An error occurred. Please try again.');
        console.error('Download error:', error);
    } finally {
        setLoading(false);
        abortController = null;
    }
}

async function fetchTikTokData(url) {
    const apiUrl = `${API_ENDPOINTS[0]}?url=${encodeURIComponent(url)}&hd=1`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            signal: abortController.signal // 添加 abort signal
        });

        if (!response.ok) {
            throw new Error('Failed to fetch content data');
        }

        const result = await response.json();

        if (result.code !== 0) {
            throw new Error(result.msg || 'Failed to fetch content');
        }

        const isPhoto = result.data.images && result.data.images.length > 0;

        return {
            title: result.data.title || 'TikTok Content',
            author: result.data.author?.unique_id || result.data.author?.nickname || '@tiktok',
            thumbnail: result.data.cover || result.data.origin_cover,
            videoUrl: isPhoto ? null : (result.data.hdplay || result.data.play || result.data.wmplay),
            images: isPhoto ? result.data.images : null,
            isPhoto: isPhoto,
            duration: result.data.duration
        };
    } catch (error) {
        console.error('API Error:', error);
        throw new Error('Unable to fetch content. Please check the URL and try again.');
    }
}

function isValidTikTokUrl(url) {
    const patterns = [
        /tiktok\.com\/@[\w.-]+\/video\/\d+/,
        /tiktok\.com\/.*\/video\/\d+/,
        /tiktok\.com\/@[\w.-]+\/photo\/\d+/,
        /tiktok\.com\/.*\/photo\/\d+/,
        /vm\.tiktok\.com\/[\w-]+/,
        /vt\.tiktok\.com\/[\w-]+/,
        /tiktok\.com\/t\/[\w-]+/
    ];

    return patterns.some(pattern => pattern.test(url));
}

function displayResult(data) {
    currentVideoData = data;

    elements.videoTitle.textContent = data.title || 'TikTok Content';

    // Add @ prefix if not already present
    const author = data.author || 'tiktok';
    elements.videoAuthor.textContent = author.startsWith('@') ? author : `@${author}`;

    if (data.isPhoto) {
        elements.contentType.textContent = `PHOTO · ${data.images.length} IMAGES`;
        elements.videoOptions.classList.remove('active');
        elements.photoGallery.classList.add('active');
        displayPhotoGallery(data.images);
    } else {
        elements.contentType.textContent = 'VIDEO';
        elements.photoGallery.classList.remove('active');

        if (data.videoUrl) {
            elements.downloadVideo.href = data.videoUrl;
            elements.videoOptions.classList.add('active');
        } else {
            elements.videoOptions.classList.remove('active');
        }
    }

    elements.result.classList.add('active');

    // 触发动画
    setTimeout(() => {
        document.body?.classList.add('content-loaded');
    }, 100);
}

function displayPhotoGallery(images) {
    elements.photoGrid.innerHTML = '';

    images.forEach((imageUrl, index) => {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';

        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = `Photo ${index + 1}`;
        img.loading = 'lazy';

        // 图片加载成功
        img.onload = () => {
            img.classList.add('loaded');
            photoItem.classList.add('loaded');
        };

        // 图片加载失败
        img.onerror = () => {
            photoItem.classList.add('error');
            console.error(`Failed to load image ${index + 1}`);
        };

        photoItem.appendChild(img);
        elements.photoGrid.appendChild(photoItem);

        photoItem.addEventListener('click', (e) => {
            if (!photoItem.classList.contains('error')) {
                openPhotoPreview(imageUrl);
            }
        });
    });
}

function openPhotoPreview(imageUrl) {
    elements.previewVideo.style.display = 'none';

    let imgPreview = document.getElementById('imagePreview');
    if (!imgPreview) {
        imgPreview = document.createElement('img');
        imgPreview.id = 'imagePreview';
        imgPreview.setAttribute('aria-label', 'Photo preview');
        elements.previewModal.querySelector('.modal-content').appendChild(imgPreview);
    }

    imgPreview.src = imageUrl;
    imgPreview.style.display = 'block';
    elements.previewModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // 聚焦到模态框，支持键盘导航
    elements.previewModal.focus();
}

function openPreview(videoUrl) {
    const imgPreview = document.getElementById('imagePreview');
    if (imgPreview) {
        imgPreview.style.display = 'none';
    }

    elements.previewSource.src = videoUrl;
    elements.previewVideo.load();
    elements.previewVideo.style.display = 'block';
    elements.previewModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePreview() {
    elements.previewModal.classList.remove('active');
    elements.previewVideo.pause();
    elements.previewSource.src = '';
    document.body.style.overflow = 'auto';
}

async function copyToClipboard(text, button) {
    try {
        await navigator.clipboard.writeText(text);

        const originalText = button.querySelector('.action-label').textContent;
        button.querySelector('.action-label').textContent = 'Copied!';
        button.classList.add('copied');

        showToast('Link copied to clipboard!');

        setTimeout(() => {
            button.querySelector('.action-label').textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
        showToast('Failed to copy link', true);
    }
}

let toastTimer = null;

function showToast(message, isError = false) {
    if (toastTimer) {
        clearTimeout(toastTimer);
    }

    elements.toastMessage.textContent = message;
    elements.toast.classList.toggle('error', isError);
    elements.toast.classList.add('active');

    toastTimer = setTimeout(() => {
        elements.toast.classList.remove('active');
        toastTimer = null;
    }, 3000);
}

function hideResult() {
    elements.result.classList.remove('active');
}

function showError(message) {
    elements.videoUrl.classList.add('error');
    showToast(message, true);
}

function hideError() {
    elements.videoUrl.classList.remove('error');
}

function setLoading(isLoading) {
    elements.downloadBtn.disabled = isLoading;
    elements.downloadBtn.classList.toggle('loading', isLoading);
}
