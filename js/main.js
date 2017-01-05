  var game = new Game()
// Main Event Listener

  $(document).ready(function () {
// ---------------Game Page------------------------

  // Player 1 Cards click
    $('.player1Cards').off('click', 'div')
    $('.player1Cards').on('click', 'div', function () {
      var index = $('.player1Cards div').index(this)
      if (game.currentPlayer === 0 && game.isGameOver === false) {
        game.player[game.currentPlayer].playTurn(index)
      } else {
        alert('It is not your turn!')
      }
    })

  // DrawingPile click
    $('.container').off('click', '.drawingPile')
    $('.container').on('click', '.drawingPile', function () {
      if (game.currentPlayer === 0) {
        var positiony = $('.drawingPile:last-child').position().top
        var positionx = $('.drawingPile:last-child').position().left
        clearInterval(moveInterval)
        var moveInterval = setInterval(function () {
          positiony += 20
          positionx += 20
          $('.drawingPile:last-child').css({
            top: positiony,
            left: positionx
          })
          console.log(positiony)
          if (positiony >= parseInt($('body').css('height')) - 100) {
            $('.drawingPile:last-child').remove()
            if (game.currentPlayer === 0) {
              game.player[game.currentPlayer].drawCard(0)
            }
            clearInterval(moveInterval)
          }
        }, 1000 / 30)
      }
    })

  // select
    $('.select button').click(function () {
      var index = $(this).index()
      console.log('index', index)
      game.insertKitten((index - 1))
      $('.select').hide()
    })

  // -------------Game Page End----------------------

  // -------------Game Over Page---------------------

  // Restart
    $('#restart').click(function () {
      clearInterval(flashKitten)
      $('.gameOver').hide()
      $('.explosive').hide()
      $('.played-cards').removeAttr('id')
      $('#avatar1').removeAttr('style')
      $('#avatar2').removeAttr('style')
      clearInterval(countDown)
      game.restart()
    })

  // -------------Game Over End----------------------

  // -----------------Main Page----------------------
  // cardsProperties
    $('.cards div').hover(function () {
      var type = $(this).attr('id')
      $('.cards p').text(cardsProperties[type])
    },
    function () {
      $('.cards p').text('')
    }
  )

  // startGame Button
    $('.play button').click(function () {
      $('.main').hide()
      $('.game').fadeIn()
      game.startGame()
      updateNotice()
      updateCards()
    })

  // ---------------Main Page End---------------------
  })

// ----------Helping Function-------------------

// Update Game Interface
  function updateDisplay () {
    if (game.isGameOver === true) {
      $('.gameOver').fadeIn()

      if (game.whoWon() <= 3) {
        $('#avatar' + game.whoWon()).css({
          'border': '5px solid yellow '
        })
      }
    }

    if (game.playedCards.length > 0) {
      $('.played-cards').attr('id', game.playedCards[0].type)
    }

    $('.drawingPile').remove()
    $('.player1Cards div').remove()
    $('.player2 button').remove()
    updateCards()
  }

// Show Explosive
  var flashKitten
  function showExplosive () {
    if (game.currentPlayer === 0) {
      $('.explosive').fadeIn()
    } else {
      flashKitten = setInterval(function () {
        $('.player2Explosive').fadeIn()
      .fadeOut()
      }, 500)
    }
  }

// Hide Explosive
  function hideExplosive () {
    clearInterval(flashKitten)
    if (game.currentPlayer === 0) {
      $('.explosive').hide()
    } else {
      $('.player2Explosive').fadeOut()
    }
  }

  function updateNotice () {
    $('.notice h1').remove()
    $('.notice h2').remove()

    if (game.moves.length > 0) {
      if (Object.values(game.moves[0])[0] === 'draw') {
        $('.notice h3').text(' draw a card ')
        .prepend('<div class="avatar' + Object.keys(game.moves[0])[0] + '"></div>')
      } else if (Object.values(game.moves[0])[0] === 'favor') {
        $('.notice h3').text(' got ')
        .prepend('<div class="avatar' + Object.keys(game.moves[0])[0] + '"></div>')
        .append('<div  class="small-card" id="' + game.player[Object.keys(game.moves[0])[0]].cards[game.player[Object.keys(game.moves[0])[0]].cards.length - 1].type + '"></div> from')
        .append('<div class="avatar' + (1 - Object.keys(game.moves[0])[0]) + '"></div>')
      } else {
        $('.notice h3').text(' played ')
      .prepend('<div class="avatar' + Object.keys(game.moves[0])[0] + '"></div>')
      .append('<div  class="small-card" id="' + Object.values(game.moves[0])[0] + '"></div>')
      }
    }

    var timeout = setTimeout(function () {
      $('.notice h1').remove()
      $('.notice h2').remove()
      $('.notice h3').text('')
      $('.notice h3 div').remove()
      $('.notice').append('<h1>')
      $('.notice h1').text('\'s Turn')
      .prepend('<div class="avatar' + game.currentPlayer + '"></div>')
      if (game.noOfTurn !== 0) {
        $('.notice').append('<h2> x' + (game.noOfTurn + 1) + ' draw</h2>')
      }
    }, 3000)

    $('.explosive-meter h1').text(Math.round(1 / game.drawingPile.length * 100) + ' %')
  }

  function updateCards () {
    var align = 0
    for (var i = 0; i < game.drawingPile.length; i++) {
  //  alert($('.drawingPile').length)
      $('.relative').append('<div class="drawingPile">')
      $('.drawingPile:nth-child(' + (i + 1) + ')').css({
        'right': align + 'px'
      })
      align += 2
    }

    $('.player1Cards').css({
      'width': (50 * (game.player[0].cards.length - 2) + 200) + 'px'
    })

    var left = 0
    for (var i = 0; i < game.player[0].cards.length; i++) {
      $('.player1Cards').append('<div></div>')

      $('.player1Cards div:nth-child(' + (i + 1) + ')').css({
        'left': left + 'px'
      })
    .attr('id', game.player[0].cards[i].type)
      left += 50
    }

    for (var i = 0; i < game.player[1].cards.length; i++) {
      $('.player2').prepend('<button></button>')
    }

  // Player 1 hover

    $('.player1Cards div').hover(function () {
      var index = $('.player1Cards div').index(this) + 1
      var height = $('.player1Cards div:nth-child(' + index + ')').css('height')
      $('.player1Cards div:nth-child(' + index + ')').css({
        'height': parseInt(height) + 50 + 'px'
      })
    },
  function () {
    var index = $('.player1Cards div').index(this) + 1
    var height = $('.player1Cards div:nth-child(' + index + ')').css('height')
    $('.player1Cards div:nth-child(' + index + ')').css({
      'height': (parseInt(height) - 50) + 'px',
      'bottom': 0
    })
  })
  }

  function updateTime () {
    $('#time').text(Math.ceil(time))
  }

  function showTopCards () {
    console.log('Showing Top Cards')
    var length = 3
    if (game.drawingPile.length < length) {
      length = game.drawingPile.length
    }

    $('.known-cards div').removeAttr('id')
    for (var i = 0; i < length; i++) {
      $('.known-cards div:nth-child(' + (i + 2) + ')').attr('id', game.drawingPile[i].type)
    }

    $('.known-cards').fadeIn()
    $('.known-cards').delay(2000).fadeOut()
  }

  function showYourTurn () {
  // if (game.currentPlayer === 1) {
    $('.yourTurn').delay(300).fadeIn()
    $('.yourTurn').delay(500).fadeOut()
  // }
  }

  function showSelect () {
    $('.select').fadeIn()
  }

  function playAudio (index) {
    $('audio')[index].play()
  }

  function moveCards () {
    var positiony = $('.drawingPile:last-child').position().top
    var positionx = $('.drawingPile:last-child').position().left
    clearInterval(moveInterval)
    var moveInterval = setInterval(function () {
      positiony -= 20
      positionx += 20
      $('.drawingPile:last-child').css({
        top: positiony,
        left: positionx
      })
      if (positiony <= parseInt($('body').position().top) - 100) {
        $('.drawingPile:last-child').remove()
        clearInterval(moveInterval)
        game.player[game.currentPlayer].drawCard(0)
      }
    }, 1000 / 30)
  }
