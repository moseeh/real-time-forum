
  // Toggle sidebars
  document.getElementById('left-hamburger').addEventListener('click', () => {
    document.querySelector('.sidebar-left').classList.add('active');
    document.querySelector('.sidebar-overlay').classList.add('active');
    document.getElementById('right-hamburger').style.display = 'none';
  });

  document.getElementById('right-hamburger').addEventListener('click', () => {
    document.querySelector('.sidebar-right').classList.add('active');
    document.querySelector('.sidebar-overlay').classList.add('active');
    document.getElementById('left-hamburger').style.display = 'none';
  });

  // Close sidebars
  function closeSidebars() {
    document.querySelectorAll('.sidebar-left, .sidebar-right').forEach(sidebar => {
      sidebar.classList.remove('active');
    });
    document.querySelector('.sidebar-overlay').classList.remove('active');
    document.getElementById('right-hamburger').style.display = 'block';
    document.getElementById('left-hamburger').style.display = 'block';
  }

  // Close when clicking overlay or close button
  document.querySelector('.sidebar-overlay').addEventListener('click', closeSidebars);
  document.querySelectorAll('.sidebar-close').forEach(btn => {
    btn.addEventListener('click', closeSidebars);
  });

  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSidebars();
  });