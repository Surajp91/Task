class BOGOSelector {
    constructor() {
        this.selectedOption = 1;
        this.expandedOption = 2; 
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
                if (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT') {
                    return;
                }
                
                const option = parseInt(card.dataset.option);
                
                this.selectOption(option);
                
                this.toggleExpansion(option);
            });
        });
    }
    
    selectOption(optionNumber) {
        this.selectedOption = optionNumber;
        
        const radio = document.getElementById(`option${optionNumber}`);
        if (radio) {
            radio.checked = true;
        }
        
        this.updateCardStyles();
        
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
        if (this.expandedOption !== null && this.expandedOption !== optionNumber) {
            this.collapseOption(this.expandedOption);
        }
        
        const card = document.querySelector(`[data-option="${optionNumber}"]`);
        
        if (card) {
            card.classList.add('expanded');
            this.expandedOption = optionNumber;
            
            setTimeout(() => {
                const cardRect = card.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                if (cardRect.bottom > windowHeight - 100) {
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
            
            card.classList.remove('selected');
            
            const radio = document.getElementById(`option${option}`);
            if (radio && radio.checked) {
                card.classList.add('selected');
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
            
            dropdown.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });
    }
    
    handleDropdownChange(dropdown) {
        dropdown.style.borderColor = '#FF6B82';
        
        setTimeout(() => {
            dropdown.style.borderColor = '#ddd';
        }, 800);
        
        const selectionRow = dropdown.closest('.selection-row');
        const itemNumber = selectionRow.querySelector('.item-number').textContent;
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
        
        const button = document.querySelector('.add-to-cart-btn');
        const originalText = button.textContent;
        
        button.textContent = 'Added to Cart!';
        button.style.background = '#28a745';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '#FF6B82';
        }, 2000);
    }
    
    getSelections() {
        const selections = {
            option: this.selectedOption,
            price: this.prices[this.selectedOption].current,
            items: []
        };
        
        if (this.expandedOption !== null) {
            const expandedCard = document.querySelector(`[data-option="${this.expandedOption}"]`);
            if (expandedCard) {
                const sizeDropdowns = expandedCard.querySelectorAll('.size-dropdown');
                const colorDropdowns = expandedCard.querySelectorAll('.color-dropdown');
                
                sizeDropdowns.forEach((sizeDropdown, index) => {
                    const colorDropdown = colorDropdowns[index];
                    if (colorDropdown) {
                        selections.items.push({
                            item: index + 1,
                            size: sizeDropdown.value,
                            color: colorDropdown.value
                        });
                    }
                });
            }
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