import Alpine from 'alpinejs';
import './style.css'
import MovieAPI from './faveMovieApi';

window.Alpine = Alpine

Alpine.data('isOpen', MovieAPI);

Alpine.start()

