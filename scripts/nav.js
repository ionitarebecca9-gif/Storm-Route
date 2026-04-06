document.addEventListener('DOMContentLoaded', () => {
    const menuToggle=document.getElementById('menu_toggle');
    const menuBox=document.querySelector('.mobile-box');
    const menuLinks=document.querySelectorAll('.menu-item');
    const menuBtnLabel=document.querySelector('.menu_btn');
    // inchidere dupa click
    menuLinks.forEach(link => {
        link.addEventListener('click', () =>{
            menuToggle.checked=false;
        });
    });
    // inchidere la click in afara
    document.addEventListener('click', (e) => {
        if(menuToggle.checked)
        {
            const clickPeMeniu=menuBox.contains(e.target);
            const clickPeButon=menuBtnLabel.contains(e.target);
            if(!clickPeMeniu && !clickPeButon)
            {
                menuToggle.checked=false;
            }
        }
    });
    //reset la resize
    window.addEventListener('resize', () => {
        if(window.innerWidth > 900 && menuToggle.checked)
        {
            menuToggle.checked=false;
        }
    })
});