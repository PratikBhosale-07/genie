const sign_in_btn = document.querySelector("#sign-in-btn")
const sign_up_btn = document.querySelector("#sign-up-btn")
const container = document.querySelector(".container")

// Add animation to input fields when they get focus
const inputFields = document.querySelectorAll(".input-field input")
inputFields.forEach((input) => {
  input.addEventListener("focus", () => {
    input.parentElement.style.boxShadow = "0 5px 15px rgba(107, 70, 193, 0.2)"
    input.parentElement.style.borderColor = "#6b46c1"
  })

  input.addEventListener("blur", () => {
    input.parentElement.style.boxShadow = "none"
    input.parentElement.style.borderColor = "transparent"
  })
})

// Add ripple effect to buttons
const buttons = document.querySelectorAll(".btn")
buttons.forEach((button) => {
  button.addEventListener("click", function (e) {
    const x = e.clientX - e.target.getBoundingClientRect().left
    const y = e.clientY - e.target.getBoundingClientRect().top

    const ripple = document.createElement("span")
    ripple.style.left = `${x}px`
    ripple.style.top = `${y}px`
    ripple.classList.add("ripple")

    this.appendChild(ripple)

    setTimeout(() => {
      ripple.remove()
    }, 600)
  })
})

// Toggle between sign in and sign up forms
sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode")

  // Add animation to form elements when switching
  animateFormElements(".sign-up-form .input-field", "slide-up")
  animateFormElements(".sign-up-form .btn", "fade-in")
  animateFormElements(".sign-up-form .social-media", "fade-in")
})

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode")

  // Add animation to form elements when switching
  animateFormElements(".sign-in-form .input-field", "slide-up")
  animateFormElements(".sign-in-form .btn", "fade-in")
  animateFormElements(".sign-in-form .social-media", "fade-in")
})

// Function to animate form elements
function animateFormElements(selector, animationClass) {
  const elements = document.querySelectorAll(selector)
  elements.forEach((element, index) => {
    // Remove any existing animation classes
    element.classList.remove("slide-up", "fade-in")

    // Force reflow
    void element.offsetWidth

    // Add the animation class with delay based on index
    setTimeout(() => {
      element.classList.add(animationClass)
    }, index * 100)
  })
}

// Add CSS for animations
const style = document.createElement("style")
style.textContent = `
    @keyframes slide-up {
        0% {
            opacity: 0;
            transform: translateY(20px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fade-in {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
    
    .slide-up {
        animation: slide-up 0.5s forwards;
    }
    
    .fade-in {
        animation: fade-in 0.5s forwards;
    }
    
    .ripple {
        position: absolute;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    /* Sign up mode styles */
    .container.sign-up-mode:before {
        transform: translate(100%, -50%);
        right: 52%;
    }
    
    .container.sign-up-mode .left-panel .content,
    .container.sign-up-mode .left-panel .image-container {
        transform: translateX(-800px);
    }
    
    .container.sign-up-mode .signin-signup {
        left: 25%;
    }
    
    .container.sign-up-mode form.sign-up-form {
        opacity: 1;
        z-index: 2;
    }
    
    .container.sign-up-mode form.sign-in-form {
        opacity: 0;
        z-index: 1;
    }
    
    .container.sign-up-mode .right-panel .content,
    .container.sign-up-mode .right-panel .image-container {
        transform: translateX(0px);
    }
    
    .container.sign-up-mode .left-panel {
        pointer-events: none;
    }
    
    .container.sign-up-mode .right-panel {
        pointer-events: all;
    }
`
document.head.appendChild(style)

// Initialize animations for the initial form
window.addEventListener("load", () => {
  animateFormElements(".sign-in-form .input-field", "slide-up")
  animateFormElements(".sign-in-form .btn", "fade-in")
  animateFormElements(".sign-in-form .social-media", "fade-in")
})

// DOM elements
const loginForm = document.querySelector(".sign-in-form");
const signupForm = document.querySelector(".sign-up-form");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const signupName = document.getElementById("signup-name");
const signupEmail = document.getElementById("signup-email");
const signupPassword = document.getElementById("signup-password");
const signupConfirmPassword = document.getElementById("signup-confirm-password");
const forgotPasswordLink = document.getElementById("forgot-password");
const googleSignInButton = document.getElementById("google-signin");
const googleSignUpButton = document.getElementById("google-signup");

// Check authentication state
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM loaded, checking auth state");
  
  // Check if Firebase is available
  if (typeof firebase === 'undefined') {
    console.error("Firebase SDK not loaded. Make sure the script is included correctly.");
    return;
  }
  
  // Check if user is already signed in
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      console.log("User is signed in:", user);
      // Redirect to dashboard
      window.location.href = window.location.origin + "/pages/dashboard.html";
    } else {
      console.log("No user is signed in");
    }
  });
});

// Login with email/password
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("Login form submitted");
  
  const email = loginEmail.value;
  const password = loginPassword.value;
  
  if (!email || !password) {
    alert("Please enter both email and password");
    return;
  }
  
  // Sign in with Firebase
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log("User signed in:", user);
      // Redirect to dashboard
      window.location.href = window.location.origin + "/pages/dashboard.html";
    })
    .catch((error) => {
      console.error("Login error:", error);
      alert("Login failed: " + error.message);
    });
});

// Sign up with email/password
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("Signup form submitted");
  
  const name = signupName.value;
  const email = signupEmail.value;
  const password = signupPassword.value;
  const confirmPassword = signupConfirmPassword.value;
  
  if (!name || !email || !password || !confirmPassword) {
    alert("Please fill in all fields");
    return;
  }
  
  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }
  
  // Create user with Firebase
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
      console.log("User created:", user);
      
      // Update profile with name
      return user.updateProfile({
        displayName: name
      });
    })
    .then(() => {
      alert("Account created successfully!");
      // Redirect to dashboard
      window.location.href = window.location.origin + "/pages/dashboard.html";
    })
    .catch((error) => {
      console.error("Signup error:", error);
      alert("Signup failed: " + error.message);
    });
});

// Google Sign In
function handleGoogleSignIn() {
  const provider = new firebase.auth.GoogleAuthProvider();
  
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      // Google sign in successful
      const user = result.user;
      console.log("Google sign in successful:", user);
      // Redirect to dashboard
      window.location.href = window.location.origin + "/pages/dashboard.html";
    })
    .catch((error) => {
      console.error("Google sign in error:", error);
      alert("Google sign in failed: " + error.message);
    });
}

// Add Google sign in event listeners
googleSignInButton.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("Google sign in button clicked");
  handleGoogleSignIn();
});

googleSignUpButton.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("Google sign up button clicked");
  handleGoogleSignIn();
});

// Forgot password
forgotPasswordLink.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("Forgot password link clicked");
  
  const email = prompt("Please enter your email to reset your password");
  
  if (!email) {
    return;
  }
  
  firebase.auth().sendPasswordResetEmail(email)
    .then(() => {
      alert("Password reset email sent. Please check your inbox.");
    })
    .catch((error) => {
      console.error("Password reset error:", error);
      alert("Password reset failed: " + error.message);
    });
});

