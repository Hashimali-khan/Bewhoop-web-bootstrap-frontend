// onboarding-tags.js - Interactive tag input for onboarding-final.html

document.addEventListener('DOMContentLoaded', function () {
  const tagInput = document.getElementById('tag-input');
  const tagList = document.getElementById('tag-list');
  const suggestionsDiv = document.getElementById('suggested-tags');

  let tags = ['Art Event', 'Wedding', 'Exhibition'];
  let suggestions = ['Lifestyle', 'Cultural', 'Comedy'];

  function renderTags() {
    tagList.innerHTML = '';
    tags.forEach((tag, idx) => {
      const tagEl = document.createElement('span');
      tagEl.className = 'tag-item';
      tagEl.textContent = tag + ' ';
      // Close icon
      const close = document.createElement('span');
      close.className = 'tag-close';
      close.textContent = '×';
      close.onclick = function () {
        tags.splice(idx, 1);
        renderTags();
        renderSuggestions();
      };
      tagEl.appendChild(close);
      tagList.appendChild(tagEl);
    });
  }

  function renderSuggestions() {
    suggestionsDiv.innerHTML = '';
    suggestions.forEach(sugg => {
      if (!tags.includes(sugg)) {
        const suggEl = document.createElement('span');
        suggEl.className = 'suggestion-tag';
        suggEl.innerHTML = `${sugg} <span class="suggestion-plus">+</span>`;
        suggEl.onclick = function () {
          if (!tags.includes(sugg)) {
            tags.push(sugg);
            renderTags();
            renderSuggestions();
          }
        };
        suggestionsDiv.appendChild(suggEl);
      }
    });
  }

  function addTagFromInput() {
    let val = tagInput.value.trim().replace(/,$/, '');
    if (val && !tags.includes(val)) {
      tags.push(val);
      tagInput.value = '';
      renderTags();
      renderSuggestions();
    }
  }

  tagInput.addEventListener('keydown', function (e) {
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault();
      addTagFromInput();
    }
    // Remove last tag with Backspace if input is empty
    if (e.key === 'Backspace' && tagInput.value === '' && tags.length > 0) {
      tags.pop();
      renderTags();
      renderSuggestions();
    }
  });

  tagInput.addEventListener('blur', function () {
    addTagFromInput();
  });

  // Initial render
  renderTags();
  renderSuggestions();
}); 