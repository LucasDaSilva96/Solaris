"use strict";

// This is for the notification of the project
export class Toasts {
  constructor(options) {
    // Default options for the Toasts class
    let defaults = {
      position: "top-right",
      stack: [],
      offsetX: 20,
      offsetY: 20,
      gap: 20,
      numToasts: 0,
      duration: ".5s",
      timing: "ease",
      dimOld: true,
    };
    // Merge default options with the provided options
    this.options = Object.assign(defaults, options);
  }

  // Method to add a new toast to the stack
  push(obj) {
    this.numToasts++;
    // Create a new toast element
    let toast = document.createElement(obj.link ? "a" : "div");
    // Set properties based on the provided object
    if (obj.link) {
      toast.href = obj.link;
      toast.target = obj.linkTarget ? obj.linkTarget : "_self";
    }
    // Set class and HTML content for the toast
    toast.className =
      "toast-notification" +
      (obj.style ? " toast-notification-" + obj.style : "") +
      " toast-notification-" +
      this.position;
    toast.innerHTML = `
            <div class="toast-notification-wrapper">
                ${
                  obj.title
                    ? '<h3 class="toast-notification-header">' +
                      obj.title +
                      "</h3>"
                    : ""
                }
                ${
                  obj.content
                    ? '<div class="toast-notification-content">' +
                      obj.content +
                      "</div>"
                    : ""
                }
            </div>
            ${
              obj.closeButton == null || obj.closeButton === true
                ? '<button class="toast-notification-close">&times;</button>'
                : ""
            }
        `;
    // Append the toast to the document body
    document.body.appendChild(toast);
    toast.getBoundingClientRect();
    // Position the toast based on the specified position
    // (top-left, top-center, top-right, bottom-left, bottom-center, bottom-right)

    switch (this.position) {
      case "top-left":
        toast.style.top = 0;
        toast.style.left = this.offsetX + "px";
        break;
      case "top-center":
        toast.style.top = 0;
        toast.style.left = 0;
        break;
      case "top-right":
        toast.style.top = 0;
        toast.style.right = this.offsetX + "px";
        break;
      case "bottom-left":
        toast.style.bottom = 0;
        toast.style.left = this.offsetX + "px";
        break;
      case "bottom-center":
        toast.style.bottom = 0;
        toast.style.left = 0;
        break;
      case "bottom-right":
        toast.style.bottom = 0;
        toast.style.right = this.offsetX + "px";
        break;
      default:
        break;
    }

    // Set width if specified in the object or in the options
    if (obj.width || this.width) {
      toast.style.width = (obj.width || this.width) + "px";
    }
    // Set initial transition state to "queue" and add the toast to the stack
    toast.dataset.transitionState = "queue";
    let index = this.stack.push({
      element: toast,
      props: obj,
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      index: 0,
    });
    // Set the index property for the newly added toast in the stack
    this.stack[index - 1].index = index - 1;
    // Set up click event for the close button
    if (toast.querySelector(".toast-notification-close")) {
      toast.querySelector(".toast-notification-close").onclick = (event) => {
        event.preventDefault();
        this.closeToast(this.stack[index - 1]);
      };
    }
    // Set up click event for the toast if it is a link
    if (obj.link) {
      toast.onclick = () => this.closeToast(this.stack[index - 1]);
    }
    // Open the toast and trigger onOpen callback if provided
    this.openToast(this.stack[index - 1]);
    if (obj.onOpen) obj.onOpen(this.stack[index - 1]);
  }

  // Method to open a toast
  openToast(toast) {
    if (this.isOpening() === true) {
      return false;
    }
    // Set transition state to "opening" and apply transition styles
    toast.element.dataset.transitionState = "opening";
    toast.element.style.transition =
      this.duration + " transform " + this.timing;
    // Apply transformation to the toast
    this._transformToast(toast);
    // Listen for transition end event
    toast.element.addEventListener("transitionend", () => {
      if (toast.element.dataset.transitionState == "opening") {
        toast.element.dataset.transitionState = "complete";
        for (let i = 0; i < this.stack.length; i++) {
          if (this.stack[i].element.dataset.transitionState == "queue") {
            this.openToast(this.stack[i]);
          }
        }
        // Close the toast after a specified duration if dismissAfter is set
        if (toast.props.dismissAfter) {
          this.closeToast(toast, toast.props.dismissAfter);
        }
      }
    });
    // Handle opening state for existing toasts in the stack
    for (let i = 0; i < this.stack.length; i++) {
      if (this.stack[i].element.dataset.transitionState == "complete") {
        this.stack[i].element.dataset.transitionState = "opening";
        this.stack[i].element.style.transition =
          this.duration +
          " transform " +
          this.timing +
          (this.dimOld ? ", " + this.duration + " opacity ease" : "");
        // Apply dimming effect to old toasts if dimOld is set
        if (this.dimOld) {
          this.stack[i].element.classList.add("toast-notification-dimmed");
        }
        // Adjust offsetY for each toast in the stack
        this.stack[i].offsetY += toast.element.offsetHeight + this.gap;
        this._transformToast(this.stack[i]);
      }
    }
    return true;
  }

  // Method to close a toast
  closeToast(toast, delay = null) {
    if (this.isOpening() === true) {
      setTimeout(() => this.closeToast(toast, delay), 100);
      return false;
    }
    // Check if the toast is already in the closing state
    if (toast.element.dataset.transitionState == "close") {
      return true;
    }
    // Remove click event for the close button
    if (toast.element.querySelector(".toast-notification-close")) {
      toast.element.querySelector(".toast-notification-close").onclick = null;
    }
    // Set transition state to "close" and apply transition styles
    toast.element.dataset.transitionState = "close";
    toast.element.style.transition =
      ".2s opacity ease" + (delay ? " " + delay : "");
    toast.element.style.opacity = 0;
    // Listen for transition end event
    toast.element.addEventListener("transitionend", () => {
      if (toast.element.dataset.transitionState == "close") {
        let offsetHeight = toast.element.offsetHeight;
        if (toast.props.onClose) toast.props.onClose(toast);
        toast.element.remove();
        for (let i = 0; i < toast.index; i++) {
          this.stack[i].element.style.transition =
            this.duration + " transform " + this.timing;
          this.stack[i].offsetY -= offsetHeight + this.gap;
          this._transformToast(this.stack[i]);
        }
        // Remove dimming effect for the focused toast
        let focusedToast = this.getFocusedToast();
        if (focusedToast) {
          focusedToast.element.classList.remove("toast-notification-dimmed");
        }
      }
    });
    return true;
  }

  // Method to check if any toast is in the opening state
  isOpening() {
    let opening = false;
    for (let i = 0; i < this.stack.length; i++) {
      if (this.stack[i].element.dataset.transitionState == "opening") {
        opening = true;
      }
    }
    return opening;
  }

  // Method to get the currently focused toast
  getFocusedToast() {
    for (let i = 0; i < this.stack.length; i++) {
      if (this.stack[i].offsetY == this.offsetY) {
        return this.stack[i];
      }
    }
    return false;
  }
  // Private method to transform the toast based on its position
  _transformToast(toast) {
    if (this.position == "top-center") {
      toast.element.style.transform = `translate(calc(50vw - 50%), ${toast.offsetY}px)`;
    } else if (this.position == "top-right" || this.position == "top-left") {
      toast.element.style.transform = `translate(0, ${toast.offsetY}px)`;
    } else if (this.position == "bottom-center") {
      toast.element.style.transform = `translate(calc(50vw - 50%), -${toast.offsetY}px)`;
    } else if (
      this.position == "bottom-left" ||
      this.position == "bottom-right"
    ) {
      toast.element.style.transform = `translate(0, -${toast.offsetY}px)`;
    }
  }
  // Getter and setter methods for various options
  set stack(value) {
    this.options.stack = value;
  }

  get stack() {
    return this.options.stack;
  }

  set position(value) {
    this.options.position = value;
  }

  get position() {
    return this.options.position;
  }

  set offsetX(value) {
    this.options.offsetX = value;
  }

  get offsetX() {
    return this.options.offsetX;
  }

  set offsetY(value) {
    this.options.offsetY = value;
  }

  get offsetY() {
    return this.options.offsetY;
  }

  set gap(value) {
    this.options.gap = value;
  }

  get gap() {
    return this.options.gap;
  }

  set numToasts(value) {
    this.options.numToasts = value;
  }

  get numToasts() {
    return this.options.numToasts;
  }

  set width(value) {
    this.options.width = value;
  }

  get width() {
    return this.options.width;
  }

  set duration(value) {
    this.options.duration = value;
  }

  get duration() {
    return this.options.duration;
  }

  set timing(value) {
    this.options.timing = value;
  }

  get timing() {
    return this.options.timing;
  }

  set dimOld(value) {
    this.options.dimOld = value;
  }

  get dimOld() {
    return this.options.dimOld;
  }
}
