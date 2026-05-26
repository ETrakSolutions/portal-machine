/**
 * Heartbeat utilisateur — chaque page du portail envoie un "ping" toutes les 60s
 * a l'API pour signaler que l'utilisateur connecte est actif.
 * La cle API utilisee: user_active_<email_sanitized>
 *
 * Lecture cote admin (index.html) : .user-active-dot voit qui a ping
 * dans les 2 dernieres minutes.
 */
(function() {
  var API_URL = 'https://script.google.com/macros/s/AKfycbxDuq4Qt2mrsLGiOGLrxSFvouttOfjDYzky27tjcKL72QSc__cR4qvu1X2qyDFCuB8V/exec';
  var PIN = '1400';

  function getUser() {
    try { return JSON.parse(localStorage.getItem('portal_user')); } catch(e) { return null; }
  }

  window.startUserHeartbeat = function() {
    var user = getUser();
    if (!user || !user.email) return;
    var key = 'user_active_' + user.email.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
    function ping() {
      fetch(API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'text/plain'},
        body: JSON.stringify({ action: 'save', key: key, value: new Date().toISOString(), pin: PIN })
      }).catch(function(){});
    }
    ping(); // immediate
    setInterval(ping, 60000); // every 60s
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.startUserHeartbeat);
  } else {
    window.startUserHeartbeat();
  }
})();
