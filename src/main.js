import Room from './room';
import Navigo from 'navigo';

const router = new Navigo(null, true);

router
  .on('/rooms/:id', (params) => {
    render("room");
    const key = localStorage.getItem(`portal-${params.id}`);
    if (!key) {
        router.navigate('/');
        return;
    }
    const room = new Room(params.id, key);
  })
  .on(() => {
    render('rooms');
    $('.select-room button').click(() => {
        const roomName = $('.select-room input[name=room]').val().trim();
        const key= $('.select-room input[name=key]').val().trim();
        localStorage.setItem(`portal-${roomName}`, key);
        router.navigate(`/rooms/${roomName}`);
    });
  })
  .resolve();



function render(viewName) {
    console.log(`Render ${viewName}`);
    $('.view').toggle(false);
    $(`#view-${viewName}`).toggle(true);
}