/*!
 * Copy Code Button functionality
 * Ensures copy buttons work on GitHub Pages
 */

document.addEventListener('DOMContentLoaded', function() {
  // Only initialize if copy code button is enabled
  if (typeof window.enable_copy_code_button !== 'undefined' && window.enable_copy_code_button) {
    initializeCopyButtons();
  }
});

function initializeCopyButtons() {
  const codeBlocks = document.querySelectorAll('pre');
  
  codeBlocks.forEach(function(codeBlock) {
    // Skip if button already exists
    if (codeBlock.querySelector('.clipboard-copy-button')) {
      return;
    }
    
    // Create copy button
    const copyButton = document.createElement('button');
    copyButton.className = 'clipboard-copy-button';
    copyButton.type = 'button';
    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
    copyButton.setAttribute('aria-label', 'Copy code to clipboard');
    copyButton.title = 'Copy code to clipboard';
    
    // Position the button
    codeBlock.style.position = 'relative';
    copyButton.style.position = 'absolute';
    copyButton.style.top = '0.5em';
    copyButton.style.right = '0.5em';
    copyButton.style.opacity = '0.4';
    copyButton.style.border = 'none';
    copyButton.style.background = 'rgba(255, 255, 255, 0.8)';
    copyButton.style.borderRadius = '3px';
    copyButton.style.padding = '0.25em 0.5em';
    copyButton.style.cursor = 'pointer';
    copyButton.style.fontSize = '0.8em';
    copyButton.style.transition = 'opacity 0.2s';
    
    // Hover effects
    copyButton.addEventListener('mouseenter', function() {
      this.style.opacity = '1';
    });
    
    copyButton.addEventListener('mouseleave', function() {
      this.style.opacity = '0.4';
    });
    
    // Copy functionality
    copyButton.addEventListener('click', function() {
      const code = codeBlock.querySelector('code');
      const textToCopy = code ? code.textContent : codeBlock.textContent;
      
      // Use the Clipboard API if available
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(function() {
          showCopySuccess(copyButton);
        }).catch(function(err) {
          fallbackCopyToClipboard(textToCopy, copyButton);
        });
      } else {
        fallbackCopyToClipboard(textToCopy, copyButton);
      }
    });
    
    codeBlock.appendChild(copyButton);
  });
}

function fallbackCopyToClipboard(text, button) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    document.execCommand('copy');
    showCopySuccess(button);
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
  
  document.body.removeChild(textArea);
}

function showCopySuccess(button) {
  const originalHTML = button.innerHTML;
  button.innerHTML = '<i class="fas fa-check"></i>';
  button.style.background = 'rgba(40, 167, 69, 0.8)';
  
  setTimeout(function() {
    button.innerHTML = originalHTML;
    button.style.background = 'rgba(255, 255, 255, 0.8)';
  }, 1500);
}
