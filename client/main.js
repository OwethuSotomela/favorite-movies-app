import Alpine from 'alpinejs';
import './styles.css'
import MovieAPI from './faveMovieApi';

import persist from '@alpinejs/persist'
Alpine.plugin(persist)

window.Alpine = Alpine

Alpine.data('isOpen', MovieAPI);

Alpine.start()

