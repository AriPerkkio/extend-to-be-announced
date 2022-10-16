import { afterEach, beforeEach } from 'vitest';

function addRoot() {
    const main = document.createElement('main');
    main.id = 'root';
    document.body.appendChild(main);
}

function removeRoot() {
    const root = document.getElementById('root');

    if (root) {
        document.body.removeChild(root);
    }
}

// Keep DOM ready and clear
beforeEach(addRoot);
afterEach(removeRoot);
