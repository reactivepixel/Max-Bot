exports.messages = {
  verify: {
    timeoutMsg: {
      en: username => `!verify timeout. Clap ${username} in irons!  Let's see how well they dance on the plank!`,
      es: username => `!verifica el tiempo de espera. Aplaudir  ${username} ¡en planchas! ¡Veamos qué bien bailan en el tablón!`,
    },
    htmlMsg: {
      en: (timeout, code) => `<table><tr><td><p>Enter the code below into Discord, in the same channel on the Armada Server. Verification will timeout after ${timeout} minutes from first entering the !verify command.</p></td></tr><tr><td><h2>Verification Code: ${code}</h2></td></tr></table>`,
      es: (timeout, code) => `<table><tr><td><p>Ingrese el código a continuación en Discord, en el mismo canal en el Servidor Armada. La verificación caducará después de ${timeout} minutos desde la primera vez que ingresa el comando !verify.</p></td></tr><tr><td><h2>Código de verificación: ${code}</h2></td></tr></table>`,
    },
    emailMsg: {
      en: timeout => `...What's the passcode? \n\n *eyes you suspicously*\n\n I just sent it to your email, just respond back to this channel within ${timeout} minutes, with the code, and I won't treat you like a scurvy cur!`,
      es: timeout => `...¿Cuál es el código de acceso? \n\n *ojos sospechosamente*\n\n Acabo de enviarlo a su correo electrónico, simplemente responda de nuevo a este canal dentro de ${timeout} minutos, con el código, ¡y no te trataré como un escorbuto!`,
    },
  },
};
