class clone {
    constructor() {
      this.notes = JSON.parse(localStorage.getItem('notes')) || [];
      this.title = "";
      this.text = "";
      this.id = "";
  
      this.$placeholder = document.querySelector("#placeholder");
      this.$form = document.querySelector("#form");
      this.$notes = document.querySelector("#notes");
      this.$noteTitle = document.querySelector("#note-title");
      this.$noteText = document.querySelector("#note-text");
      this.$formButtons = document.querySelector("#form-buttons");
      this.$formCloseButton = document.querySelector("#form-close-button");
      this.$modal = document.querySelector(".modal");
      this.$modalTitle = document.querySelector(".modal-title");
      this.$modalText = document.querySelector(".modal-text");
      this.$modalCloseButton = document.querySelector(".modal-close-button");
      this.$colorTooltip = document.querySelector("#color-tooltip");
  
      this.render();
      this.addEventListeners();
    }
  
    addEventListeners() {
      document.body.addEventListener("click", event => {
        this.handleFormClick(event);
        this.selectNote(event);
        this.openModal(event);
        this.deleteNote(event);
      });
  
      document.body.addEventListener("mouseover", event => {
        this.openTooltip(event);
      });
  
      document.body.addEventListener("mouseout", event => {
        this.closeTooltip(event);
      });
  
      this.$colorTooltip.addEventListener("mouseover", function() {
        this.style.display = "flex";
      });
  
      this.$colorTooltip.addEventListener("mouseout", function() {
        this.style.display = "none";
      });
  
      this.$colorTooltip.addEventListener("click", event => {
        const color = event.target.dataset.color;
        if (color) {
          this.editNoteColor(color);
        }
      });
  
      this.$form.addEventListener("submit", event => {
        event.preventDefault();
        const title = this.$noteTitle.value;
        const text = this.$noteText.value;
        const hasNote = title || text;
        if (hasNote) {
          // add note
          this.addNote({ title, text });
        }
      });
  
      this.$formCloseButton.addEventListener("click", event => {
        event.stopPropagation();
        this.closeForm();
      });
  
      this.$modalCloseButton.addEventListener("click", event => {
        this.closeModal(event);
      });
    }
  
    handleFormClick(event) {
      const isFormClicked = this.$form.contains(event.target);
  
      const title = this.$noteTitle.value;
      const text = this.$noteText.value;
      const hasNote = title || text;
  
      if (isFormClicked) {
        this.openForm();
      } else if (hasNote) {
        this.addNote({ title, text });
      } else {
        this.closeForm();
      }
    }
  
    openForm() {
      this.$form.classList.add("form-open");
      this.$noteTitle.style.display = "block";
      this.$formButtons.style.display = "block";
    }
  
    closeForm() {
      this.$form.classList.remove("form-open");
      this.$noteTitle.style.display = "none";
      this.$formButtons.style.display = "none";
      this.$noteTitle.value = "";
      this.$noteText.value = "";
    }
  
    openModal(event) {
      if (event.target.matches('.toolbar-delete')) return;  
        
      if (event.target.closest(".note")) {
        this.$modal.classList.toggle("open-modal");
        this.$modalTitle.value = this.title;
        this.$modalText.value = this.text;
      }
    }
  
    closeModal(event) {
      this.editNote();
      this.$modal.classList.toggle("open-modal");
    }
    
    openTooltip(event) {
      if (!event.target.matches('.toolbar-color')) return;
      this.id = event.target.dataset.id; 
      const noteCoords = event.target.getBoundingClientRect();
      const horizontal = noteCoords.left + window.scrollX;
      const vertical = noteCoords.top + window.scrollY;
      this.$colorTooltip.style.transform = `translate(${horizontal}px, ${vertical}px)`;
      this.$colorTooltip.style.display = 'flex';
    }
    
    closeTooltip(event) {
      if (!event.target.matches(".toolbar-color")) return;
      this.$colorTooltip.style.display = "none";
    }
  
    addNote({ title, text }) {
      const newNote = {
        title,
        text,
        color: "white",
        id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1
      };
      this.notes = [...this.notes, newNote];
      this.render();
      this.closeForm();
    }
  
    editNote() {
      const title = this.$modalTitle.value;
      const text = this.$modalText.value;
      this.notes = this.notes.map(note =>
        note.id === Number(this.id) ? { ...note, title, text } : note
      );
      this.render();
    }
  
    editNoteColor(color) {
      this.notes = this.notes.map(note =>
        note.id === Number(this.id) ? { ...note, color } : note
      );
      this.render();
    }
  
    selectNote(event) {
      const $selectedNote = event.target.closest(".note");
      if (!$selectedNote) return;
      const [$noteTitle, $noteText] = $selectedNote.children;
      this.title = $noteTitle.innerText;
      this.text = $noteText.innerText;
      this.id = $selectedNote.dataset.id;
    }
    
    deleteNote(event) {
      event.stopPropagation();
      if (!event.target.matches('.toolbar-delete')) return;
      const id = event.target.dataset.id;
      this.notes = this.notes.filter(note => note.id !== Number(id));
      this.render();
    }
    
    render() {
      this.saveNotes();
      this.displayNotes();  
    }
    
    saveNotes() {
      localStorage.setItem('notes', JSON.stringify(this.notes))  
    }
  
    displayNotes() {
      const hasNotes = this.notes.length > 0;
      this.$placeholder.style.display = hasNotes ? "none" : "flex";
  
      this.$notes.innerHTML = this.notes
        .map(
          note => `
          <div style="background: ${note.color};" class="note" data-id="${
            note.id
          }">
            <div class="${note.title && "note-title"}">${note.title}</div>
            <div class="note-text">${note.text}</div>
            <div class="toolbar-container">
              <div class="toolbar">
                <img data-id=${
                  note.id
                } class="toolbar-delete" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAjVBMVEX///8EAgQAAABZWFmgoKDl5uWop6gpKimPkI8tLS1SVFL19fXExcStrK2+vb7W1dZCQUJMTEyysrLR09HJyslkZGSbm5smJSaVlZU8Ozze3d41NjXt7e2Cg4L5+fkZGhl4eHhvbm9GRkZfX18RERF9fX0/QT9SUlIVExUiIyIeHB5zc3MPDQ8VFxVjY2MiHChpAAAFlUlEQVR4nO3da3uiOhQF4BqF1kGBeqvKpaJ1bMc55///vIO00zPNjhpiQgJd62MfjPstCCThcndnMIE3DSfjse/7gzPx/clktE5NFmEuwWT+xCRzWKxtl1s7Xnbi9eRyQvZD2yXXireX530ik4ntsuWzrOv7QMZT25XLJfqp4ns3PuS2q5eIr+qriFvPdv1XU9wArIyOb6lB/yZfRXR6hxM83go8EV0+bty8Bt+JI9uOs5nrAJ6Irp7h+HqAJfGnmweN6La96Bfi3jZGlDzWBnT0p6htG62Ib+5tp7m+bbQi+rZBJAMxUKZ3KPzci3Mr8UlUKGO/Dw/j0Wwarb0q649E0XQaRbNRONivzhAHtkVcQiHwbSExQDF7FBnZyrGVuKNFMraRHIARdUcYm5mtuGbSV0GNS+mPz0TEzGC99SPYSGtVOKVENjRWrUqOtMBVrQYER1Onzk7zIV9g7Z/Rgf6PxmaKVUpKNjLWr9nEiDZRGKlVLSO6Amp3Y1dE6NIPkfyK2Evtkfol3dBNlKqYB1LdY+02ZlTo0HzGnlQnfyz8DN3SHRpZJMMXKgNmdFfj0OGCnLOpjJeR06LOCe/bJVQYhbAqzE8JzoaOk7LwwuJnGqHC6EIjVUk6bN5iszts41WySobn80KKe7uw9JnQfen9haWTJInjx36R3TZmFewlp6n54qRGL64OZsh9LrnBuP6ld3jJTBh7UF6DSQt8vRNRdWCOnCm6GvYcKAHzlqzCntopVJl1G36E72FHJeGkNcAeS5SEixYJ1bqSWZuESl3JTZuESl3J7gsLCN0JhBC6n3rCUbItE2+3z+0R9lhc1RzHOwlheKFL6m4+u8NSQtvV3hAIOyCUmZeF0OlA+E2EdMa6RWFbCL+FkMyntynsAOG3EE5bLZS5FCu6PrOnMDmoKVcrkRGmWZnj8Tgvs+ufws/wsm3fUvhOOYurP59KLY7HfVm42tV+3ByUxat3+QsYNd0Exs+yWbzdgwj13MnnkJC/+Q9CyUDYYCBUDIQNBkLFQNhgIFQMhA0GQsXk/B1JtFcWRFzINeg5v0RErmJKrzZytzXTP7zjHyVA2x3xgwkv/BIeGW8gF/YO+CXonUU2hdwS9wIhtwgR8reHsR8QQgghhBBCCCGEEEIIIYQQQgghhBBCCCGEEEIIIYQQQth+IZl5bUgoMVerlutzy9aEmubbIYQQQgghhBBCCCGEEEIIIYQQQgghhPBLAv657RBCCGGHheTxGhBCCKFpIXlmiitCbfd68u/JcUio6VlAELZf+KPzwu6vQwghhBDC/4VPEEII4Z+GyavqOiccQAiha0LSt+icsPvrEEIIIYTQvNCZo0X6q+vrMH02JNx1Xjjnv3rpjHAKIYQQQgghhLzwtSkhKa4hofe768K080LvxaKQyz8C4e3Pgm5uK834JdKQC7nOJeeXCMnTuj1+CXJazW8IDQobCoTKIcKNnnZrZw2har6hsNDTbu1EjQnnetqtnWljwp2edmtn1phQ5nWmJhI2JpR5rbCJTPhCjAlXuZ6G62bcmJB5ehqum70p4b9cw7Z2pvyuVJ+w4IWCcf0GkvL3IpRC+johpYRUSIdqjGdNgD3B24QU8yog9jX9+2Qz6JEiBJefqWZBGy+NcXHMsmx5yuI9g7/ij2vm7w9/tFe1/ZBlm2IneGN1WYK2fXoqaL7X8Nu5RQVo7KfSfY0D0bafOYU/qXciers4R/eEWlehYLjTfnSPFvHDtdbDhoFeITk5tRzGIs3Au4B/OqrVME1vr/wSelpoL8zMibF37wqRsYUJYLWhOmE0sol+EI8uENmbyXfZhuIzxCZ9bK77MPE16camsfzuoabHP1/IurBlLL830dYjvGxcrprtOf1JETY2yJd7s8nYHzQYfxzSt0BL5T+raNDaDsmWvgAAAABJRU5ErkJggg==">
              </div>
            </div>
          </div>
       `
        )
        .join("");
    }
  }
  
  new clone();