document.addEventListener('DOMContentLoaded', async function() {
    console.log("Dashboard page loaded");
    
    // Check authentication state
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            console.log("User is signed in:", user);
            // Update user info in the UI
            updateUserInfo(user);
        } else {
            console.log("No user is signed in, redirecting to login");
            // Redirect to login page
            window.location.href = window.location.origin + "/pages/Login.html";
        }
    });
    
    // Setup logout functionality
    document.getElementById('logout-btn').addEventListener('click', () => {
        console.log("Logout button clicked");
        
        firebase.auth().signOut()
            .then(() => {
                console.log("User signed out successfully");
                // Redirect to landing page
                window.location.href = window.location.origin + "/pages/landingpage.html";
            })
            .catch((error) => {
                console.error("Sign out error:", error);
            });
    });
    
    // Setup create room button
    document.querySelector('.create-room-btn').addEventListener('click', () => {
        createNewChatRoom();
    });
    
    document.querySelector('.add-room').addEventListener('click', () => {
        createNewChatRoom();
    });
    
    // Make chat room cards clickable
    const chatRoomCards = document.querySelectorAll('.chat-room-card:not(.add-room)');
    chatRoomCards.forEach(card => {
        card.addEventListener('click', () => {
            const roomName = card.querySelector('h4').textContent;
            openChatRoom(roomName);
        });
    });
    
    // Initialize theme switcher
    initThemeSwitcher();
});

// Update user information in the sidebar
function updateUserInfo(user) {
    const userNameElement = document.querySelector('.user-name');
    const avatarElement = document.querySelector('.avatar');
    
    if (user && userNameElement) {
        userNameElement.textContent = user.displayName || user.email || 'User';
    }
    
    if (user && avatarElement && user.photoURL) {
        avatarElement.src = user.photoURL;
    } else if (avatarElement) {
        // Use default avatar if no picture available
        avatarElement.src = '../assets/avatar-placeholder.png';
    }
}

// Function to create a new chat room (placeholder)
function createNewChatRoom() {
    // This would actually open a modal or navigate to a creation page
    console.log('Creating new chat room');
    alert('Create new chat room functionality will be implemented soon!');
}

// Function to open a chat room (placeholder)
function openChatRoom(roomName) {
    // This would navigate to the chat room page
    console.log(`Opening chat room: ${roomName}`);
    alert(`Opening ${roomName} - This functionality will be implemented soon!`);
}

// Initialize theme switcher functionality
function initThemeSwitcher() {
    const themeButtons = document.querySelectorAll('.theme-btn');
    const htmlElement = document.documentElement;
    
    // Set initial active state
    const savedTheme = localStorage.getItem('theme') || 'system';
    setActiveButton(savedTheme);
    
    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.getAttribute('data-theme');
            localStorage.setItem('theme', theme);
            
            if (theme === 'dark') {
                htmlElement.setAttribute('data-theme', 'dark');
            } else if (theme === 'light') {
                htmlElement.setAttribute('data-theme', 'light');
            } else if (theme === 'system') {
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    htmlElement.setAttribute('data-theme', 'dark');
                } else {
                    htmlElement.setAttribute('data-theme', 'light');
                }
            }
            
            setActiveButton(theme);
        });
    });
    
    function setActiveButton(theme) {
        themeButtons.forEach(btn => {
            if (btn.getAttribute('data-theme') === theme) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
}
