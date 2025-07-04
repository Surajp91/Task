class BOGOSelector {
    constructor() {
        this.selectedOption = 1;
        this.expandedOption = null;
        this.prices = {
            1: { current: 10.00, original: 24.00 },
            2: { current: 18.00, original: 24.00 },
            3: { current: 24.00, original: 24.00 }
        };
        
        this.init();
    }
    
    init() {
        this.setupRadioButtons();
        this.setupCardClicks();
        this.setupDropdowns();
        this.updateTotal();
    }
    
    setupRadioButtons() {
        const radioButtons = document.querySelectorAll('input[name="product-option"]');
        
        radioButtons.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.selectOption(parseInt(e.target.value));
            });
        });
    }
    
    setupCardClicks() {
        const cards = document.querySelectorAll('.option-card');
        
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking on dropdown or radio button
                if (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT') {
                    return;
                }
                
                const option = parseInt(card.dataset.option);
                
                // If clicking on the same card that's already selected, toggle expansion
                if (option === this.selectedOption) {
                    this.toggleExpansion(option);
                } else {
                    // Select new option and expand it
                    this.selectOption(option);
                    this.expandOption(option);
                }
            });
        });
    }
    
    selectOption(optionNumber) {
        this.selectedOption = optionNumber;
        
        // Update radio button
        const radio = document.getElementById(`option${optionNumber}`);
        if (radio) {
            radio.checked = true;
        }
        
        // Update card styles
        this.updateCardStyles();
        
        // Update total
        this.updateTotal();
        
        console.log(`Selected option: ${optionNumber}`);
    }
    
    toggleExpansion(optionNumber) {
        if (this.expandedOption === optionNumber) {
            this.collapseOption(optionNumber);
        } else {
            this.expandOption(optionNumber);
        }
    }
    
    expandOption(optionNumber) {
        // Collapse any currently expanded option
        if (this.expandedOption !== null) {
            this.collapseOption(this.expandedOption);
        }
        
        const card = document.querySelector(`[data-option="${optionNumber}"]`);
        const content = card.querySelector('.option-content');
        
        if (card && content) {
            card.classList.add('expanded');
            this.expandedOption = optionNumber;
            
            // Smooth scroll to show the expanded content
            setTimeout(() => {
                const cardRect = card.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                if (cardRect.bottom > windowHeight - 50) {
                    card.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }
            }, 200);
        }
    }
    
    collapseOption(optionNumber) {
        const card = document.querySelector(`[data-option="${optionNumber}"]`);
        
        if (card) {
            card.classList.remove('expanded');
            if (this.expandedOption === optionNumber) {
                this.expandedOption = null;
            }
        }
    }
    
    updateCardStyles() {
        const cards = document.querySelectorAll('.option-card');
        
        cards.forEach(card => {
            const option = parseInt(card.dataset.option);
            
            if (option === this.selectedOption) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });
    }
    
    setupDropdowns() {
        const dropdowns = document.querySelectorAll('.size-dropdown, .color-dropdown');
        
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('change', (e) => {
                console.log(`${e.target.className} changed to: ${e.target.value}`);
                this.handleDropdownChange(e.target);
            });
            
            // Prevent dropdown clicks from triggering card expansion
            dropdown.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });
    }
    
    handleDropdownChange(dropdown) {
        // Add visual feedback
        dropdown.style.borderColor = '#4A90E2';
        setTimeout(() => {
            dropdown.style.borderColor = '#ddd';
        }, 500);
        
        // Log the selection
        const dropdownRow = dropdown.closest('.dropdowns-row');
        const itemNumber = dropdownRow.querySelector('.item-number').textContent;
        const isSize = dropdown.classList.contains('size-dropdown');
        const type = isSize ? 'Size' : 'Color';
        
        console.log(`Item ${itemNumber} - ${type}: ${dropdown.value}`);
    }
    
    updateTotal() {
        const totalElement = document.querySelector('.total');
        const currentPrice = this.prices[this.selectedOption].current;
        
        if (totalElement) {
            totalElement.textContent = `Total : $${currentPrice.toFixed(2)} USD`;
        }
    }
    
    addToCart() {
        const selections = this.getSelections();
        console.log('Adding to cart:', selections);
        
        // Show feedback
        const button = document.querySelector('.add-to-cart-btn');
        const originalText = button.textContent;
        
        button.textContent = 'Added!';
        button.style.background = '#28a745';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '#FF69B4';
        }, 1500);
    }
    
    getSelections() {
        const selections = {
            option: this.selectedOption,
            price: this.prices[this.selectedOption].current,
            items: []
        };
        
        if (this.expandedOption !== null) {
            const expandedCard = document.querySelector(`[data-option="${this.expandedOption}"]`);
            const sizeDropdowns = expandedCard.querySelectorAll('.size-dropdown');
            const colorDropdowns = expandedCard.querySelectorAll('.color-dropdown');
            sizeDropdowns.forEach((sizeDropdown, index) => {
                const colorDropdown = colorDropdowns[index];
                selections.items.push({
                    item: index + 1,
                    size: sizeDropdown.value,
                    color: colorDropdown.value
                });
            });
        }
        
        return selections;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const bogoSelector = new BOGOSelector();
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            bogoSelector.addToCart();
        });
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key >= '1' && e.key <= '3') {
        const optionNumber = parseInt(e.key);
        const radio = document.getElementById(`option${optionNumber}`);
        if (radio) {
            radio.click();
        }
    }
    if (e.key === 'Escape') {
        document.querySelectorAll('.option-card.expanded').forEach(card => {
            card.classList.remove('expanded');
        });
    }
});