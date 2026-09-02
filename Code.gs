function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Pearl Go | Ang Biyaherong Ahente')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Pearl Go — Consultation Request & Lead Magnet Mailer
 * Called from the website's "Consult Now" form AND the
 * "Download Free Checklist" lead magnet form.
 */

var PEARL_EMAIL = 'goinnersparc26@gmail.com'; // change if needed
var LEADS_SHEET_NAME = 'Pearl Go Leads';

// Base64-encoded Pearl Go logo (car+house mark, gold on transparent), embedded
// inline (via cid) in the header of both outgoing email templates.
var LOGO_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAGQAAAA6CAYAAABGZvzTAAAvBElEQVR4nO2cd5xeVbX3v/uUpz/Te81kJr2TEEIgEEroCAnSBS6CgoCgoL5c76v36rVdBRUpYgEEKUoVBQkEgQTSe5v0yfRenplnnnbK3u8f55kQRRCvWP541+eTZLLnnH322WuvtX6/tfY+Ij7Sz7+6' +
  'iOxfAoVULprKoISLUiZCBLxrxCjDLb9VxvAONEZQroXAQaGB0JEigNRCCDMHzZ+LHijBjJSh+0uEZpYgCaLwAfqRp6p/wrsa4p/w0L9WDMNF2jFUZp9yYo2kkwM4vgnkV50uhLRI9m9RvkipyKmYLxLpJiV63ybgxhDCRiBQSiCVQApQSqCEBphYWgBlRJXmK4JILVq4' +
  'DsL1BKK1QukloIVA8yFd4B+kHpGID/xDHvTXiwKRQWa6UPE1yu59CxHfi6PnoUouJafybOGk+xja/wul967G9RcQnPAJouUnimTfO0o1P44vdQhdWShcXAxcTFAKoVyvf5RnB0KhCw2lGzhaBEfLg5zJGAWz0SOz0IM1Aj0HhI+svf7d5F9PIQLPJbndOINvqkTr8wSd' +
  'Q2jCIBOeTWj8jWDUCWtggxra/kOibjMCF6F8WHqEdN6JFM35jDCFpmIHHsHXvwqcYdLhKZilJ6IkSMcGN42UaYSyEMrCdLsJJHajk0GhUErg4MMSudihGQSrlmDkHSuEUQJaAITmDVZ9tJYjkqODH2mHf5s4oIZxYm+qxP6HCNlNGCgyvkKc0svJqbtMkEnQsfn7KtS3' +
  'El32oQsfaSMH8OFzRpG4pEUJ/lm3Eq1aLDL9a1Wi8WEoXEjJ7NuEyvR5FqJ5sUJpfoRRiJZeo5Kbv4jpDmWtBoQCqTw3ZymTpKhGr7yA3OpzPMUYIaSr+Cit5l9CIQKJlBmw9qrYrvsIjq7FFEmkESHhm03urC9iBOvEYNNLKrH7Z4Ssw/hUGldEGAgeQ9lxX0JXDj0b' +
  '7yEvtRkl0zjSZDR/IWVzb0MP5InhkV7y86rofuPflGkNotBRUiMjw5Se9m1CYY3kplvxuSMoIRECUAolsyOUCumAdDWSWjGy9HTyG64UGBUIPYCmGUgp/+a5MIT4Z4Z1hVIuyAEG9z+qjPbnCMhOhCaIm7VotVdTOG6ZkOl+2t66Q5n9KwmLJCiNuKhG1H+CuunXCH+4' +
  'CqkEtWdMo2fnQ8o9+Ag+RogOvMXAyj3o4y5T5bOuF9LqJ+yOosk+UAJHCoTjR2ZGEKF8UDpSgBBjCEuAJjylCAm6QlOSiNuF3fYYQ53LlVN2NkUTrhAiUAOYaJqG0HSk6/6vZsT46Cb3rxdNZEj0vaOGd/6EwMgWDD2NpQex804md/pnRSBnPIP7nlGpxvsJOt2gBJYb' +
  'YCQ0g9K5t5Nbe7IwtQhCaOhCoIWqqJx/pxgsO071r/s20eQugqkurL330tK3QRVMOA1XWWhS88K5lEgFUinPGtAAzXNASqFQCKGBBsr1rkHz4ouOIuh2Y7U8Sk/7CuWrPJe8hqVCC9f/TW5MpBNDH+EUf9CTQNd1XMcFIXFSLQzseVjZzc8TkiOASzJYS3jyJylouEik' +
  'BptUz6Z7CAyvxqdSKKkYkSVo45ZSNf8W4Q/VIoSOEgqhhPeALHJCKaxMN12bfqLcQ0/gd3oRaDiGH0PLoKNAabhSYrt+oqf+iNyCYpLrP4ehhtDGuhMCle1XuS5SKk+JrsJ1pefCpItyBZYrGBWVBOsvpGDiMhGIjEMq3esLDfUh3ZlIJ/9eChFoQiCVQmh4PlmmcdI9' +
  'xFteVvHGp/C57WjSxjJDULyYkjm3CaXnMLTnSZXY9zhRYiAtMoRJBKZRNO9WiutOE5oewUq1M3TwVSXdNP6CKWj+qEi0vaE0oSiYfKkww+MQ0iLe/rbqWf9D9MGN+EQaTRcIXfO4iZTY0k/+aT8ip7CUkdW3YMoYQqgsiNJQY0BKSqSSKKlQLkgJruuipES5EsdRKFfD' +
  'UT4SoojwhHPIrf+YCBdMAQJ8WB5j/G9Ma2wtjv2McAAH5aZRMgEqgbSHlWuP4mZiOOlBMqPdWP37YfgQptVNQGZw8ZEKzyB/zo1EiheIxMAm1fnO/UScPYTdDI5SJGQRqZILmHra7cIMVaFrJqBwU+1kdt6NZqUYnXQ5vkiNUnvuxVUamYpZyh+uFkIPkVN9mgiXzKB9' +
  '62NqZM/D+DPd6LqLEKCUx/xdO4nylYqkf6ryD2/EEGkQAiEchFBZF8SY8Xn3Sc9KUCqLfBUKG0065Dtt2I0/p3ffC8otnk/ZrMsJFkwTui8PgQ80kUVw71XSX8fUBYCLkjY4cZTbrZLDjaT6duPGmlCZXvwyhaHSgDU2epAuumsTcCTKyWC7gpSvDLN+GRVTLxUymaRx' +
  '+X+o8OAawiqOFA4uPob8U6k75b+Ils0ThpmLECCEhlIuSkqVsjV0V2AoDSUNLFcikQTsFKAhhEDoPkSgnOpjbxX2lHNpXPEN5RtcTcAe9GiEsGhd/QCaGVXFx39DjLb9QQ3v/gUhqx2BRAjXewcBSDzGr8giKk8ZrkvWnQFSYaOQrovf7sXteIWh3lW0GyXKV7OIsinL' +
  'hD9Sj25GEJrxHsMRmVTsAxQgPEyuXFx3CCfRouKda3AHdqBn2hDOEJpKAK7ncpWBFN7AhALdTSJcGyW9QTtSJ2NEkcWLKJ55FZqZKzq3Pacyh1/CzHQipAXCIGMU46tfStW8T4tgtA7d8B29IlBKYqU6Ge1do5BgRMcLTfdhDaxTEpdgyWIRzpmAEDpHxxZXZnAzMQab' +
  'X1fdax/AjDdiKAclBJavCFW+mLqF1wtDKDXU+CR2+6voTgwdx+tBaSgpcJVAYeCIIJbwI7UQmi8XPZCH8OWgmxF0M4Aw/QjdQNcE6BoS08sEGJWnhAsa3ioqrHmPUj5AIQrlppCZVmLtbyirez3OSDM6CmlEMCOlBHIq0II5CF3DseI4iW7kaA+aNYRmxRCZOLguUoEr' +
  'gliRaUSmXk6oeLIYOrxeDe5+Dm14D8JJowmBo4exc2dSedxnKBh3ijDNPISmv3dkyiUZa6R19feV5lqExp+JGSpgtPExXCEpmXebyCtZ4L3sEZfsKUUqkG6KdOwAPTt+peJ7nsPM9CKUg9RMrNyJFM2+loK6hSLdv0MNbv05ItGMo0XQwpX4CxoI5NViRMrRgwUY/nxh' +
  'mCHQdJSSKNfGdVK4dkq5VhLHSmJZGaRSKGGg9CBogTmaER4yzEiLaYTRfRFCwSiGafx52KuUg5tqYaj5BZVqXYGTSaJHJxAadwn+ogn4gnlIa4jEwB7kwD7kcAsi1YVwUmiuhVISR0kvkacFcEKVBOrOobBmEfHuQ/S8/h3ldm/A5w6jJDjCT0KvIDrtYupnXyECuePR' +
  'dBOB9j5LBWSmV9H2OspNksmtAqcap3k5Siky0z6uJI7QMI6KkB500gQIPUioYBo1J35RDNecoLo2/gy3Zx24KZzhVlq2PEdGL1lUO+V8ESmdx3DPHhWKlgozVASajnRTWPEulYp1Yo/sUHaiFyfZh50aQqZi2FYaxwVXi2JEq/Dl1+DPqyGYk0cgXCh8gSi67s8utgBC' +
  '82VRDxjij4K6QqkUo33r1MDWn6JS3YiiuRTP+RjRohnClRmSvZtV/45HsLvWEZQxdGllYaQXpFyyCEb4cQLFUHYsReOXkEwO0fzGD3B6tmO6MQwlcdCwjGL0svlMOOFmESmbh2mE8cjq+0c3AQgjJOxgjUImMXx5KC2M7StHKRtNCyIQnub+TDdCCITQEWYeBfVniUj5' +
  'HFq3PKKc0X4Kq+dRUDlHmMESL0emBwlGK0RqpEkNNb9BqruR9MBBSPUgZArpWCjppfkdPYKIlOEvnkF+xTwKa2YLPZCD46RwU0PKSXTh9O9T8UQ/bmoQy1aUTF1KuHSB0A3PvQorNTxmFkiZZKT9VdW2/n78uVWUH+NNEtIh2bdFdW66D61vPQE1jC5AA4RSKKUhlcBF' +
  'IIWONKI4xXMpaFiMmxihq/EN1GAjppXwahpC4Oph3JypFM65isrpFwifv9AjYR8C9SkUTmYIO9WNUi6akQuaIDPShBCu8udMFP5gCUKY/BlM+Gd6UyiZQck0rp3BSvVhxw6oWMdWYq0bcGLNGPYwmhtHYKFDNqWv4+oBpL8UUTyLkknnUFAzV6AHkKlekj1b1UDLaqz+' +
  'PWiZIXQ3jiYzCBxvVEoj6W+g9rwfiXD+DDTNfFchUmZID25WB5bfSW716dQu/rLQzSAyM0j3nqfV0OYfELD6MIVEFxKJF9ik5kfLKkQql1SolNJZF9DTtBercwtmZhhcG6EUEoUrQmT8ZeTOvJiG4z4l9GAJmqaj/ZVJA28aZdYSsoQQhRIaQklA83y6lChA0zS0IzEl' +
  'e610cd0krpNCpToYbFuvuvYsR/Y3YtoxpEyjI707hIuQLiiBkgYYQUbNEsITz6N+3hUiEK1HAKmBtapp5T0YQzsx7GGE5mTnyPEWj3S8XIAQKAWW8hPLXcDMC+8XgXCZ52SVdHCtYXasuJu8kgWMO/lOoZsRrHQ3h978jrKbniHgDqOEp1tLD+LoEVSkilDtCYRzKlGu' +
  'Ij7UymjrLlJvPoHPiWO6DhLbsyBhkjHyMWvPYdri60WkYDqa7ud/m0sTCMRYdU94LFgpDaSLLS2QFlaql+7u9gmhaPGB4uJ6L0elHJSTQTqDjPTtVr17/sBI2xrEaAfCHsGnLBxNgdDQELjo6HjsXCkDSYBUoJLqE26ioeEUEYhUezEAxcjgXg5v/BXawG5MaxhdOTim' +
  'gX/cqQh/LkMtG/EnO9FkCiEdj9fINIGh7cS71inf+HOFsNIxHDtB+54XVeuGRzjuysdFKLcOaQ1waNX/qNHtj+BTiTHHjWNE0SoXU3PcJ4kUTxOaMJEig5cDMnHtNKPdO1XruoexWlaBdMkYUcL1Z1K78DpRUDY7G8Q0xIdwTx9kIx4pkyjpolQa1xlmqHcfhw9sUZH8' +
  '8ouLy6c/m1swDtMMAA7SGmK4c4vq2PVbrM5tMNKOUEk04Xr1MAFK6F4lMVJOUdVkkv1tuP37UXaGlF5E7pxrqDv2ShGIVIAbx0r3I+0MhhlG9xchECQHdqnO1fei2t5EOClSRBCTLqFh8Q0i0bZGdb1zH0aiBaFsj6YpnXTlWUy/4EdCWKkYqdE+Xn/8BjXt+IupP/Ya' +
  'IdwkrZt+onpXfQ9TxvES5Bp2qIaKhbdRPmOZSA4207r1VyrRvgGZGkIXGkZOBdHqBZTPvlj4wyV07/uDGulrpnLaGSKvbDZCmNk48WFkLPeT5R4olFJ47CuDcpJk4h3E+g6o4a49DPR2o/tzKayZd3rlxAV/CASLvHhlDTHYsUENHHiNRMta7FgzpkqjjeW9spaVEj70' +
  'wgkU1C8mXFxDvGM78QOr0OKtIE1SeVNoOPMrlNQtFPHePXRs/aWKt2zAHulAc2yE4cPIGUeoZhFV8z8hQjll9G19RPWuuQctM4ytdNSES5h69n8JO95My/IvK9W7HaEsFJAI1DD10ieFsNJDKDfBcN82FcopFiM9zWqg8RXie1/G7wxlM6CSdKSW2jO+TuG4haJl42Oq' +
  'Z+2D+J0YmnC9fA8uSAOpNNxgBZWLPkvVMVcJw4x4LBHdswihZcmmOAL1PDSksqBobJKk16dyUc4IoyOdJPr3qlTfXhK9jcR7m0gl04SKJlE8cQkVk04R/pwahCZQ9jBDbevV4MEVxJpWI+JtXvZAeFAcKb30OxppPY/w+FOonLOU3OIK0bntZdW77RnM0TYULhIdK28O' +
  'Uy78tsgtGk/r2gdV94ZH8Tm9oISX91IChUQqA1BYviqqFt9O5axzxcCel1T78q+g2XEsYVKw6MuMm/9JMdy6SrW+8u8Qb0MAlpHLuIsexhjp2kzTm3cre6QTLd2vTDeJ5lgEpY0cY+n+QipO+Cx51ceKAyvvVbHND+OTaVxNYpuFmJEiXCWx491odhw92UHHG9/BSo2o' +
  'ugWfEr1tu2pHmt9sziudQDC/WviChej+CMIwPIuRCtdNI60EVnoIa7RLZWLtJAdbSA4cJD3UirJH0KQEfw6+wgmUzLicssmnC39OrUcArSQjnWvUwMHlDOxZgZ7qQXdT+JSLUl6aQ0rhcSR8uKFygg3ncMyxl4pgXjn9h95SW578rDKHD2A6GZBemj0VrGHGeV8TOXmV' +
  'NL76DZVqfAqfm0FKE9ufjz+vGowAMtGPFW/DsDOY6XZaX/tvbDup6uZdJlJDbSq25gF0O0P76ocprDuZ3OpjhVlQr9LxLjTXRWoOjpXEiHdsUFrHKoLKQUchpMdmx4idKwzc0gUUTzxL9O5+WQ1ufBTTtbD8UfzjTmfGkluFP1SJ0BWpWBt7Vz2oUvtfQk/F6VvzU3w5' +
  '1aq04XjR8toqEuvvw9X9Smo6rmYiND9CGAjleFBQptGUzPpWB1d512mhUsyyBZRNOo3iupOEESlDaBpOJkm8e5Pq2/N7Bg+twpfqwkeCoCtxcEGCm3V1yhW4GDj+cnKmXkj9cdcIM1RAJtHBluc/r1Tnanz2qKd0JXGUhqVFqT75VqLFUzj09v0qvftphJMio4XR6s9h' +
  '5mm3Cn+4Eq9gkiHWuUUdfOP7aL07MJxBOlfeQ6SoSlXMv04M7l2ptIGtBO0O+vYtV8G8q4UZKiShNKS0saWJ5otOMEZ7DyKVRAai2Bgo10I5NsqxEcpFmPlMXHwd0o7Ttu4XaE4K6QsQmX0l0xd/QWhm2BsQECyIMuvsb4jW4hrVs/JBpB2jY/0vKKufS/1J19Ly/C0I' +
  'J4UOaFoWrQrQkNk8j0AZAZS/GF9+AwUNi6icsFDo0Rp0TUMqCzvRzeCeVapjz0rSPbvwuUPobhK/ctAFSM1zfcpVSKnjSomSOraZi95wDrMX3yx8oXKUcuje9zvV9MbdBK1udJX24K0EVwpcqXDzGiifdLpIDOxWA9ufwrATOCJA/jG3MP6ETwnDF8mybQFEKKxdLHIv' +
  'n8TWZ7+gVNda/HY/h1f9jMIr5lFz8jW0/eYQOMN07H6dsiknqpH+w0jHAamR0osI5dYcNKSryKRBBAuITjqBwppZaL4gMjPKwJ4VJHpj+PLHi+5dy5Uea/YWQ+kspp30eaGZ0T8Kw0LoGIF8quZcLbr3bVL0rEaPHaT70DpVVjdfpLQ8pdv9aAqUq6EMH5oZwgmXklM9' +
  'g4LaBURKJuILVwgjEAalcDID9B16RQ0c3Ijduxcn0YOwhhHSIoCXJRBCgQaOAlwdlMKVCke5OFoUrWohkxbfJHKKp6MZPlyrnx2vfEdZza/gd4YxhPJWyBh4ABwRpvyYi9B0HwdW/Rwt3eOlgioXUb/wOmH4c7I7T456f92HEaxk9tJviR1PfUrJgX24ndvobX5HFdUs' +
  'FE6gUGEnsIebaF//OFZ/M8qRSDOHupNuIJxTjhEpm0mf+g1GXydDgy8R27YSI1qAFgwiRzoQRXPRhI/BA2vRZAblC5PfcCqaL+f9wCh6oID64z/Ogd9uBjfOSNsWKiefSXDy2dh9BwjmVhIuGUekxIspwWgZyjBB2mQS/QwcflsNde4k1bsXK9aBSg+guylQLloWZggE' +
  'QoArxJGV7YEBF1cqbGVC7gQqF95IxYQlwhfKR0qXka4Nau/y76L6t2OoBLoQSE1DU14xzZVgu+D4ciipO1YoZxS7exfKdcmIEJMXXofuz32PMrxnKxA6eqiKnIbTiA01ocskLdteprT+VLTCibijnYRlgtjuV3BtC8tfROExV1E97XwhdBOjZNJZwpaGUqkBXDuDkjZS' +
  'OUgpEGXzCVfOAaEh0wMe69UCFFZNQ2ja+xbBNM0kWjZDaKES5aZ6SQ21o3QfM878D+HaSVwUlm1hJYcZGOxWqUNbyAy1kB5uIxPvRWRiKMfyFKCBpoeQWhgEuAKcI2BYeGjtKHwmlcJROgUTTqF2wbUiUjgBTfejlEProTdUy8ofo422oZm5uCKKCx4y8wgBLtJrK5iA' +
  'P1xGZrRVSSuNEiFEtI68splCaB8M3YVmUjrpFAa3PwvWIE6sDem4FE5cRFvvPhA6RqSEUOkUihpOpqhmgTADOYDA8OdUUHfslSKRGCCTiuG66SyLzNYpUQy0bVFOJoGUOiiBbWU+uCIpBEaonOIF1+GmE5i5lQgMlBZiODGEwgLpIJCEogXjwuGoT6+Zvl8Twtu1IQQI' +
  'XQihIXRxhLt4daIxuDy2L0R7z1AUBqHcGjQjdGQlKyUoLp8sCi78LzQUQnmFrrF+UVK50spWAyVaIF8Y/nyU44jSE25VUmbQQyUYvtwjy+F9Xx+NaOlMUbzwDoWbQPPnIESQihkXiYKaBWhmCCNbNxGGL1u3yd5rpYc9KOimScUHGOw6eGKst+ntZKwNJxVHWhmwk2j2' +
  'KAYOyhekePZFTJq3TPylTXtCZMnc2CQq0ISGVH+m4H9UDjB7qaeAsclXf3zN3ypeGuUvd5bd4vAnLR9W/vr7hJUe/qMGTQhQEqW8cuhYegI19gCBErqXbnZcXMfN1oYVmtDQDR3TMND1D8vI/78cLe9JsUqljuxbFeje4sYLWLbjYts2qXSK/S2tZzWI360DlgGzgAjQ' +
  'CTzZzLKiaRNr3w74TXT9vRW/v7dIqRDa35Yp+2fJeyzkT0VKieNKRhMpXvrDO8+cVb+tBVgKjAfagG8Cu4HJwNeB8uyt3xvOvfpLDeMqsu7B6+vvaTlKKSzboaWrj7xolMK8MPpfCMD/avLnFeLtkcF1JV29Q/h6floH/B5v0p95Yeek6pOOO+ayCfXVLfpYEAZiw6NY' +
  'h++dDOzJ9nRXoP62L4ZDAXr7Y2za2fjVk4475uu50dBH/iJKwdBwHKf5vi8A3wPuD0343C2RcPAjf9bfU96naK1IJlP8/Ncvv+Hr+WkL0AQ8tTOx5Pro5Dsuuejc047fe7j1xsGd353x6K9/u3wsOOblRkgWXbcXaM/2dOW6Lbtu2d54cL7e9ZOW44re/lrm0D3f+Sg2' +
  'Jf+p2I7DM6++sxxPGXT5L/lxIOD7C3f968l7YohSioOHO8gd+eXXlk7lFGD9W23H/v5jS076+tx0mvjeu/OAzhNKCQJ3lJVX3HH0/VmXNAYvLFdK/+49+/6jaiI1AE+sq/y3z80Sd77fgITwotef20T2fqKA2EiCpZO21Web7phYV7XbeJ/45Upvg6iue8Bkx95DczQh' +
  '3KkTx+0wjfdWLjVNx3Gc7M/vRiZNeMcVPkr5o6fbjsOOxkPHV8vnHwBmAw+mS67/zNLp+ZiGgW3bALnAmB/Yc+K86feOuSxXSrbvbbpjfj4V2d+/eOKxM+8WgrtXvJP/zUjI1/6Za2f/+M9VCRWQTKUZHh4l4DMpKMg9MqYDh1obilK/TgC1TeqCsFJKr9d+WwS0jeRd' +
  '9XZ1RSm/f3PN8+c00ADYg5Ervv/qK6t+eWbdph/0ha4Ymji+6rChawwMjiDbHjCAJ4CenaNLdhQXFqyptJ9dBfTH4zfXjSaStHYPnDdjYu1LkUiIwaERnv79yrUXz2hsBPTlB+eELz7vlIt9psFLr6/52vzSd36+JXbqRSfMnf7D4dE0qzfvujcUDjWfeMzku/Nzo0fm' +
  '5VBzB8tXbtp22Zy9x/UFL6suzM892NE7MC8vEt5UWV5EwO9Z85EYYtk2Ta3dFMQf3wdMBB7Qa266OS83cgQpdfUOoXc++FPgUwArO47/0cXnLr4NvIB9qKWb3OFH9wKTgEOt+rKrZk1pWGtZFhnLIRz0Yxg6/YMjbNq570sDQyPHXHT2ostCwQAdXf34en/+Gh5YWFo4' +
  '4//sjI+msA7/6GrgfsACtgDjgHygEHhbq7n5JMPQsJruXQGcDvxP9t/ZeCc4f6PX3rR0NJkm2Pfwm0DNi00LNl0wft024NxDzvnfrDd+9xvAB7wMzAfS73Sf8OT0CXV35sUf35R95jJgANi6tv+Ur5910txvDDfetSh7z9antk3OvXz23jBQBrhP75y254bLzzleSsVw' +
  '411VwJqsAewBioAdwBLgLa36psuKCr0FqAE4jsvgUJyC+OOvZJWxaSDnqpvzcqNHlOE4LvubO5aNKQPYd8aJc28DcFzJzr2HZ+QOP/proB7Yuc85746J46rWvrZyw52J/T983Gm+7+ltjQdPSyYziI4Hnzy24M1vnlW/eXoiaZGxbJ5fsWZzdoB5B5zzawdjcazDP7ob' +
  'eBSQW1Pnf07W3LoEuCSrjOEWsezL4XCAd7bsuR04GRgEZgBnAm9mxxkbGk4Q7Hv4u8DEF/fP2zV7csM3gKuAxgnja17JTtIC4AygGHi0uqLst3nxx5/Dg/SXjxZ9ehXwb4B5fNGbM4Yb71oAPA5EgarLZ+996Klds3uyiyD3khm7T7Jsl+HGu+YCO4HUbnvpZ1Tt508D' +
  'zs0quBT4ajBgMiYaQDKdQev8yQzgLIBf754iJ9SW/xFETaczTPH9roV35bs+v4+u3kEGd/6PVm49fT8wEzgtnnf1zAWzp7yoaYJjC996E7gSmFdRWvyHbJWwIrtafhwK+hiJJ7lsVqOd7fdbE+uqX1JtDzQAtwNyr33hlacvnPfLUCAA8I3sdcsn1lW+4zgu8/NePwyY' +
  'QM4jb5ec6pR9agC8mAXcvGHH3p8CnwbS4UiwudZ6/CtAyyH3Y883tbYvfmpDZdEzu6ffne2jp0lesGpzY9NXs4od7Y9es6KkqJCswgGqgdqjnvHgcO5V914+fdsdeO7cOqwuXPTCitUPAa8BoY0jZ9678JjpLxbk5YJnwT5gX3/kyv2BYOBdhbhSMjg0ArBprHHulAn/' +
  'qf0Jfo/FEwBfPqrpnfje79fpnT95FXCBRcADHeYlI1UVJZiGgWU5ZNsBXi4syKGjdwC81cz6vkVFpqGz93DbUmAOkHy7e1FJW/fAbDz3BPCfx8+d+ZKuCX73+ts/Bc4B2Bhbsi4Q8NHZHwO4K3vt8zdec2nw1TXbfoVn6SO9wSvKTq9Z/yu82DdyesXbO5/bNa0ilnPV' +
  '2aVF+cvH8WL50nPPrLp42q4xBDCzrqZ8xbLJW3cBYeCxmsoKfH4fT+6Y+nGAg+75/w1ckL0+fpilG0cT6TnAY9m2y2uryt44o2a9AAqA+xbNP+a+QMDProOH64DP4S3IH5YV5v0RV9JQioxlw1EBvqWjZ2kmY5NIphiJJ0hnLHbta/ocnpkBJIDvALcAq4G3su0/qrSf' +
  '/vGOfc3HZSybwx19c/HIYuaVg8eUCaBg5Je3jClo8fHHfC2dtphsvjQHb8XsmTO14c4q+9dNeK6A1sAnnvf5fHR197GkZm1Z9t4dc6bU/TCdtsgf+sU1eHFHruo6viMYDHDu+I0N2eu+6PfpTcDi7P83Jgqu/fll5y0+MZFKzYkMPXr51pHTCrNJxnkAe63zTjzc2nkG' +
  'nnUAvGA7NgcOt3LFzMZu4IsFOZHdYwsDmDmprvKtdVt33w80AKOd5sVN7d2D84ALAZ7fN2daMOAjlUxTmXj0Ujw3yFudx08Jh961DgBD0zQK83OQcZ7F88+cVr1+Xnzv+omA89M38g7dcM0V4pi8N2JH3fdpY9wtTwb8JkLTGIyNft3s+sldwB3Aglr32a/2D37q3Grn' +
  '6VE8E157wZKFF8eGE+jwbYBXDs1JLWtQrHhn4z0nVXJrtt8LlHdK/7/HHpS2rMLdBw9TFHvoRuCUbHNna2fvaePFb9aT5R3Ai2cumn+79HBofratOnf4l5/Bs/4YcEl48JEN9iCJSjhtdc/C/nNPnXNnd08fZN33ZN9Lk4EksBCPTz1pH7xrfjH8DOhKFlxz1+FD7Z8r' +
  'yCcXoMP8eP4kv9l80YzG7wHPA/HY8MiMqaFXk4AfYNmkrVceap5NQeyRYt71Mq/PnzHltlQ6w+H2HkqL8sjLiaAJIciNhkkVX38p8CwwDEwAVgL1t336apFMZ8CzBoB4Y+YctyAvSigYIOj3UVGSz4v7Zk07SmGzDh5uuwLPOgC+resa72ze+X28nBelRfnvrNu654aT' +
  'Ktddnb1GbomdcnE09th1wK6xjibKp18tij3UBDwMXJOdrMXjxW8efK15zk+AR4DDLx+Y5g+Hg5imzrNbJ8SBVqC+TVu63Rx3829XtMx/HjgA3AisTxdff/3Hliy60zQMCgvyAW7FQ0Lf0Wtv+qEx7pY4HlJLAiuAT1J54ydrqsvJzw01AhuBi8ZXl2/1mSbPbp/871kF' +
  '5k4NvfqVbcOnVADP4bnz7oLYI9teaDzml2QtH7g6JxLAOnzfhQXxx9vsw/cVWbbtwV5NCFzp5ataO3vGpzJOcVVp4friojyUVCx/e8sd8/NfH/PTL4UnfO788FEpCSkl/Tv+x8SDpgBtq7tPfOKEsnfuwAuUFW3mxyur7WevB27IXtOMB/02A18DbOCJt1rn2aefdNyn' +
  'neb7TWAtsKZNW/qrmVMb1gwNxXl19ebHDENLnDh3xmdKi/KxbRvLssnLzXl3V5FSJJIp/D4fmq4daXMcF6UUuv5uumeMfyqlUGNJybHfSUnGshFC4Pd5J2zHkq224+XljGxfyVSGfYda5w6NxKdNqa99rLgoj77BEfSOBwUQ7g9dXlyUfOpc4F6AFi5cPGFc5Uqr+f45' +
  'ePHylsikz9//F5OL8XiC1KEf/Rfwn9mmhYUz/s/aMQSmgEQiSfLAPffyrhX99yHnvPX1xkvP4h2w6wG+NBT9xGP58cfHeMrZO0bPKp8ZWX4vXvBMretf/K2zTpr3DZ/PzGaXJaahHaldSJXdQTJ2jExlNzSosb1c3v8tC9KWRTqTJplKk06n56XTmdLhpFU7mkjWpTKZ' +
  'UsuyChxHhqSrfK6UPoXSkd6xSFAIgdI1YWlCs3VdT/l8/oFQKNAWjQQP54b9hyORyMHcaE5TTjiI36ej6WDoOgiB47jEE2l27jlw5d4Dzbcsm7n3gqylHMBzp4/8bt+M8vMn7XwM+AEw2mF8/NJZUxs2/5FCjrxo9ksGmqbR3NJFaPAX3XiYeWTT4MnfPOfUhd8du8dx' +
  'XX7x3Ksvf2zi9rEgtzuWe8308uI8nnh++fplM/c9/9L+mYuu+NiZ5/n9OhnLZnBolL6hoWnlmadPBB4E0juTZ9x08nGzH9E1nbGSkHdsWTEymmYoNkJ779Cy7t7+U0+tWnMrXhCeDNThEbfxeDC0nKzv/gdKD3CDrLjhxUPtPWdM0H5TghfbyoB9wCrgUmBsI8J+IJ5t' +
  '/3er5LpMRVmRVy0dU0jGsli1YcenZ0VWGMB5wGU5U24fWbV++02zc/5wf7ajdaL6puOLs6zScVzWb99z7gT9dw8DJcDo253H/+yCMxbdbhj6EQULAbbjsnt/85xK+5lhvHjQnR0kwN2B8Z/9AkLnYEvbvL1NbTeeXrPhu3gg4zw8SPyvnCn8cbv+8Yer3GczwAY8131h' +
  's3H5yIxJ4zcPj6bRWu7ejsfTnrBKP/WJsuJ8Ly+W3aQx5iYNgNjIKFbTvXmzIjyI5yI/mSm5fsQ0TMIBXzewLdv+b3k5Xuo8nbF4e8P2G2ZFX/8mHnNue6Pt2OXLzjrxdsPwIL0QAtt22NJ44NTx/ObUSvgC8LUO88qbK+0n2vEU0t+uL3tm14qVz55Vv+PcKghUeXTr' +
  'uuzL9gFbgUN49Zf9ePWXXa8cnPXL/Lyc7dFgsMUfCPQEAv5uv9834DN9raZpoOu6V4/3Kmze2XIpcRwHy7Jq05l0aTqdKUllrNKRRGp8fDTRcPb4LZfiWds4oAqPxJZm37ECqMz+ObIHakfizI0zw8+242XF+/api689btbkN4/1mUgXtJZvlmSVwZ7U2S8dlx9lbI7+' +
  'VMTIcB/rt+29eIr/5aezbWv9429bmBMNIoQgY9lYXlIRv+lR/K7eQYL9D8/KKgrgmS7fpV+bOrFm99HZ0vhokidefH3lsmm75wJta2Nn/PyME4+9u6tngEjfg2OxZLFTev1Ko+fnL+CRqCef3znlmumT6u6qKC97vjA3jJYNnEJ4Z9+9jRDZk1DZKCu8FfDubpQPKheO' +
  'xZzsz2NeWnF0bFJHimpjcWrM4h1XMjAcp7W95+quru5zzly84DLV9uNfZRfYg/r42z9TXFiAZTs88cKrvzi7bu0n8FIqDYH6Ww9FI6H3PYYhBge6SB64JxcPpwO8njfti0t85rsTK6UilU7TNzBMaOCR8XiQLw9oe+3w7DXnn77oimg4xNHs3nYc/rB62y3H5K74FqAa' +
  'nWVXnjh32ksjiQzOwe/eD9wEPK/X3HxRNBIklU4DYJomhqGjaxpC07wa//9WPsJNEX8qMovKPPBhE9/7g68DXwEyr7Wd8EhtdcUzk3hmAh6BzgMuNsfd8mxONPyBVVMxMtzH25t2Xj8r/NrPjmq/dtPI6dGccKipf2DouIUlb79AlvTh8YiX3+pcMHrCnGm3lRQVYJoG' +
  'lm0Tjydo7eyZ19rWcsWSkxfdPrr/h+PxXM3IzsyF12m6sKYZL5yLl1da3eW/9IZpE2p3H22+SrmgHBR69sQTIF0cZxSEjqYHQdk4VhLd9CGEH6VsHCvN2N4s3fBhGAEcZxSBhmGGUYDrZlDSRQgD1x4FzQVXIZVA00wMX8T7kpDteJ/sQKAbQUxfgA8yOVdKtuzYd3It' +
  'v/kWHqEESOGFhOaXDszes3TJCRd4yvjgPQYik4oxPDLKU797fe1F0/dW4flNgCE8UmThHdZ4Bfhsk7xgycTx1StyIiF0XcO2bVpa2tl74OD3/aFwe1F+3sba6sq3c3IiNO5vnlluPfMEMB3PAr1zCfC9vtDlT04aX930x75UYWdibH/9flU//wKRXzzD04cTZ+PTd6pI' +
  '/UKmzLtYpIbbWf/cV1Xt/EsYP/1M0dq4Qh1Y+2smnn7DTCUNefBA4xdOPfPqaw9u+pXq3vEKk5bcPK6ocm5Lb88+4kO9Z5TXTHht/863lF+l6Nr1OhNPv3HBro1r1p269LNi78qHVGa4h/I5582Lj45OyCuu+lVF5Yy/eK7FdhzaOnpZuX7rb8+duOO7QM873Qs/NXNy' +
  'w5cqy7x6x4c5LWYIIcjNiXDNRecc39I+l62N+x/qH4rP1TRhRcP+1rLiojfGV5c/UFacTyDgZ4FhrDi6g+HhUaLRKKeefMLtfr8f3Xj3KPLE8dU7Gg9+/Npq59kBvKDWvrpn4cWnLDjmG1OiYf40gamUJDbUwkjPHvauzagF500RQjMwTB/2UBM+jgMlCfh15EgrkVAI' +
  'pcCnC9K9hyguq98Z8OfhCxdfi9AIRouQymLHS99tPvai/xS5uWXomvaa6cth6qxzRP/ht1TbYAflVbPXh3PGC0MLeMfNnFFKKqZtjlrW5g97ENU0DMbXVlBbVfYx1z0DBVw4U//Sn77jX1QIeMExFPQzZUINUybUXDfGRT6MRouLC973d8GAn2OmNWxy5ZdwHPewruss' +
  'na1vfr/rXTvDYN9hVTV9IftXPoe1pA9/0MsnSgVDA810deyok6nuJulmUEKCEGiaDydj03Zo8wUZyyqaMeeChxAaypczfdpZn9+99ZUH1IZnv6HmXnSnEAQIBHK9T2MII0smBQXF447A0ERqhJb9ay7tGRg+/oTFl37urzkHqeva37Sz5s/eOYZgPgoRQmDoOgG/D/N9' +
  'oB54scPOdBOPdTOcVNhOmu2rf63GRiGlQyCYQ35hzeHC4lqhvA9d4cUNFyUMyiomvTiu4diHXDd7SEfTnHD+OI5f9n+FbUve/OVXlJ2KTfY+26e8Q6zSyZ7w8tqEgkAwh/Kaqb+urpt+/5G+/kHyL7NpybUzbN288nsz510iZh13paiddRbdO19HyjTKdXB1H7ovij9Q' +
  'QCBchOYLA94kugow/Ri+MIFAPmtXv/xV6TpIOxN1bJtQQT0nX/1NEXQ1nMzonrG1JpWDo+vex3SyfUkJQg/g80WpKK878Ic3nnvEdez3GfVHL//UL8q9K4pEehhfMNRtOYJgMETB+BNPwJe3urPzMLm5eZTOOAszt+J8TRMkLUnN/EuIZ7Szi5QkYwQX1Bx/4bqm/Wuv' +
  'U0hduek8UFhKBQfjA7WRgqqWUP5ETr75HpHJeFalmxq2Fj2zeu4lr/b2D1BVVYqUErO4HhEp4dCe1den7UxRVUn+6//IPZD/D4Uv8TrxQcfTAAAAAElFTkSuQmCC';

function getLogoBlob() {
  return Utilities.newBlob(
    Utilities.base64Decode(LOGO_PNG_BASE64),
    'image/png',
    'pearl-go-logo.png'
  );
}


/**
 * ---------- Google Sheet Logging ----------
 * Auto-creates a spreadsheet named "Pearl Go Leads" the first time the
 * script ever runs (stores its ID in Script Properties so it reuses the
 * SAME sheet on every future run). Two tabs: "Consult Requests" and
 * "Checklist Downloads".
 */
function getLeadsSpreadsheet() {
  var props = PropertiesService.getScriptProperties();
  var sheetId = props.getProperty('LEADS_SHEET_ID');
  var ss = null;

  if (sheetId) {
    try {
      ss = SpreadsheetApp.openById(sheetId);
    } catch (e) {
      ss = null; // stored ID is stale/deleted — fall through and recreate
    }
  }

  if (!ss) {
    ss = SpreadsheetApp.create(LEADS_SHEET_NAME);
    props.setProperty('LEADS_SHEET_ID', ss.getId());

    var consultSheet = ss.getSheets()[0];
    consultSheet.setName('Consult Requests');
    consultSheet.appendRow([
      'Timestamp', 'Full Name', 'Email', 'Preferred Date', 'Preferred Time',
      'Situation', 'Property Type', 'Goal', 'Timeline', 'Budget', 'Location', 'Message'
    ]);
    consultSheet.getRange(1, 1, 1, 12).setFontWeight('bold');
    consultSheet.setFrozenRows(1);

    var checklistSheet = ss.insertSheet('Checklist Downloads');
    checklistSheet.appendRow(['Timestamp', 'Full Name', 'Email']);
    checklistSheet.getRange(1, 1, 1, 3).setFontWeight('bold');
    checklistSheet.setFrozenRows(1);
  }

  return ss;
}

function getOrCreateTab(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Diagnostic helper — run this manually (Run ▶ with this function selected)
// to see exactly which spreadsheet ID the script is writing to.
function debugCheckStoredSheetId() {
  var props = PropertiesService.getScriptProperties();
  var sheetId = props.getProperty('LEADS_SHEET_ID');
  console.log('Stored LEADS_SHEET_ID: ' + sheetId);
  if (sheetId) {
    try {
      var ss = SpreadsheetApp.openById(sheetId);
      console.log('Opened OK. Name: ' + ss.getName() + ' | URL: ' + ss.getUrl());
    } catch (e) {
      console.log('FAILED to open stored ID: ' + e.toString());
    }
  } else {
    console.log('No sheet ID stored yet — one will be created on next log call.');
  }
}

function logConsultRequest(row) {
  try {
    var ss = getLeadsSpreadsheet();
    var sheet = getOrCreateTab(ss, 'Consult Requests', [
      'Timestamp', 'Full Name', 'Email', 'Preferred Date', 'Preferred Time',
      'Situation', 'Property Type', 'Goal', 'Timeline', 'Budget', 'Location', 'Message'
    ]);
    sheet.appendRow(row);
  } catch (err) {
    console.error('logConsultRequest failed: ' + err.toString());
  }
}

function logChecklistDownload(row) {
  try {
    var ss = getLeadsSpreadsheet();
    var sheet = getOrCreateTab(ss, 'Checklist Downloads', ['Timestamp', 'Full Name', 'Email']);
    sheet.appendRow(row);
  } catch (err) {
    console.error('logChecklistDownload failed: ' + err.toString());
  }
}

/**
 * ---------- Follow-Up Email Sequence ----------
 * Every consult request queues 6 follow-up emails (Day 1, 3, 5, 7, 9, 11)
 * into a "Follow-ups" sheet tab. A daily time-driven trigger (set up once
 * via createDailyFollowUpTrigger) calls sendDueFollowUps(), which checks
 * the queue and sends whatever's due — this is how Apps Script handles
 * "wait N days" since a single request can't stay alive that long.
 */
var FOLLOWUP_DAYS = [1, 3, 5, 7, 9, 11];

function scheduleFollowUps(name, email) {
  if (!email) return;
  try {
    var ss = getLeadsSpreadsheet();
    var sheet = getOrCreateTab(ss, 'Follow-ups', [
      'Email', 'Full Name', 'Day', 'Scheduled Date', 'Status', 'Sent At'
    ]);
    var today = new Date();
    FOLLOWUP_DAYS.forEach(function (day) {
      var scheduled = new Date(today.getTime());
      scheduled.setDate(scheduled.getDate() + day);
      sheet.appendRow([email, name, day, scheduled, 'Pending', '']);
    });
  } catch (err) {
    console.error('scheduleFollowUps failed: ' + err.toString());
  }
}

function emailShell(bodyHtml) {
  return (
    '<div style="font-family:Arial,sans-serif;background:#FBF8F1;padding:30px;">' +
    '<div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;">' +
      '<table role="presentation" width="100%" style="background:#122540;border-collapse:collapse;"><tr>' +
        '<td style="padding:24px 12px 24px 28px;width:52px;vertical-align:middle;"><img src="cid:pearlGoLogo" alt="Pearl Go" width="46" style="display:block;border:0;"></td>' +
        '<td style="padding:24px 28px 24px 0;vertical-align:middle;">' +
          '<h1 style="color:#E4C878;font-size:22px;margin:0;font-family:Georgia,serif;">Pearl Go</h1>' +
          '<p style="color:#ffffff;font-size:13px;margin:4px 0 0;">Biyaherong Ahente</p>' +
        '</td>' +
      '</tr></table>' +
      '<div style="padding:32px;">' + bodyHtml +
        '<p style="color:#8a9080;font-size:12px;line-height:1.5;margin:24px 0 0;text-align:center;">' +
          '🤝 Honest Service &nbsp;•&nbsp; 🛡️ Trustworthy &nbsp;•&nbsp; ⭐ With You Every Step' +
        '</p>' +
      '</div>' +
      '<div style="background:#E9EEE1;padding:16px 32px;text-align:center;">' +
        '<p style="color:#4B5347;font-size:11.5px;margin:0;">© 2026 Pearl Go — Biyaherong Ahente. Cavite & Nearby Areas.</p>' +
      '</div>' +
    '</div></div>'
  );
}

function callButton(label) {
  return (
    '<div style="text-align:center;margin:24px 0;">' +
      '<a href="tel:09701496420" style="background:#1E4B3A;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:100px;font-weight:bold;font-size:14px;display:inline-block;">📞 ' + label + '</a>' +
    '</div>'
  );
}

function getFollowUpEmailContent(day, name) {
  var greetingName = name || 'there';

  if (day === 1) {
    return {
      subject: 'Kamusta, ' + greetingName + '? Andito lang si Pearl 👋',
      html: emailShell(
        '<h2 style="color:#122540;font-size:20px;margin:0 0 14px;">Hi ' + greetingName + '! 👋</h2>' +
        '<p style="color:#4B5347;font-size:14.5px;line-height:1.6;margin:0 0 16px;">Sana maganda ang simula ng week mo! Gusto lang naming i-check kung may tanong ka na tungkol sa consultation request mo. Walang pressure &mdash; andito lang kami kung kailangan mo ng gabay.</p>' +
        '<p style="color:#4B5347;font-size:14.5px;line-height:1.6;margin:0 0 20px;">Just reply sa email na ito o tawagan kami kung ready ka na mag-usap.</p>' +
        callButton('Call Pearl')
      )
    };
  }
  if (day === 3) {
    return {
      subject: '3 Common Mistakes ng First-Time Home Buyers (Iwasan Mo \'To!)',
      html: emailShell(
        '<h2 style="color:#122540;font-size:20px;margin:0 0 14px;">Hi ' + greetingName + ', quick tip lang! 💡</h2>' +
        '<p style="color:#4B5347;font-size:14.5px;line-height:1.6;margin:0 0 10px;">Heto ang 3 common mistakes na nakikita namin sa mga first-time buyers:</p>' +
        '<ol style="color:#4B5347;font-size:14.5px;line-height:1.7;margin:0 0 18px;padding-left:20px;">' +
          '<li>Hindi kinukumpara ang Bank Finance vs Pag-IBIG bago pumili</li>' +
          '<li>Hindi na-bubudget ang extra costs (transfer tax, notarial fees)</li>' +
          '<li>Bigla na lang bumibili nang walang na-che-check na documents</li>' +
        '</ol>' +
        '<p style="color:#4B5347;font-size:14.5px;line-height:1.6;margin:0 0 20px;">Tutulungan ka naming iwasan lahat ng \'yan &mdash; free consultation lang ang kailangan.</p>' +
        callButton('Call Pearl')
      )
    };
  }
  if (day === 5) {
    return {
      subject: 'Higit Isang Dekada na Kaming Tumutulong sa mga Pamilyang Katulad Mo',
      html: emailShell(
        '<h2 style="color:#122540;font-size:20px;margin:0 0 14px;">Hi ' + greetingName + '! 🏡</h2>' +
        '<p style="color:#4B5347;font-size:14.5px;line-height:1.6;margin:0 0 16px;">Higit isang dekada nang naglilingkod si Pearl sa Cavite at nearby areas &mdash; tinutulungan ang mga pamilya na maintindihan ang proseso, ihanda ang mga documents, at pumili ng financing na best fit sa kanilang situation.</p>' +
        '<p style="color:#4B5347;font-size:14.5px;line-height:1.6;margin:0 0 20px;">Handa kaming tumulong sa\'yo rin, sa tamang paraan &mdash; honest, walang commitment, puro gabay lang.</p>' +
        callButton('Call Pearl')
      )
    };
  }
  if (day === 7) {
    return {
      subject: '\'Di Ka Pa Sigurado? Normal Lang \'Yan — Heto ang Sagot',
      html: emailShell(
        '<h2 style="color:#122540;font-size:20px;margin:0 0 14px;">Hi ' + greetingName + ', may mga tanong ka ba? 🤔</h2>' +
        '<p style="color:#4B5347;font-size:14.5px;line-height:1.6;margin:0 0 10px;"><b>Paano malalaman kung eligible ako sa Pag-IBIG?</b><br>Kailangan mo ng 24 monthly contributions &mdash; tutulungan ka naming i-check.</p>' +
        '<p style="color:#4B5347;font-size:14.5px;line-height:1.6;margin:0 0 10px;"><b>Gaano katagal ang proseso?</b><br>Depende sa dokumento, pero mas mabilis kung kumpleto agad ang requirements.</p>' +
        '<p style="color:#4B5347;font-size:14.5px;line-height:1.6;margin:0 0 20px;"><b>Paano kung mababa ang budget ko?</b><br>May options pa rin &mdash; kausapin lang kami para malaman ang best fit.</p>' +
        callButton('Call Pearl')
      )
    };
  }
  if (day === 9) {
    return {
      subject: 'Ilang Slot na Lang Available Ngayong Buwan',
      html: emailShell(
        '<h2 style="color:#122540;font-size:20px;margin:0 0 14px;">Hi ' + greetingName + '! ⏳</h2>' +
        '<p style="color:#4B5347;font-size:14.5px;line-height:1.6;margin:0 0 16px;">Nag-fi-fill up na ang consultation slots namin ngayong buwan. Kung seryoso ka pa rin tungkol sa pagkuha ng sarili mong bahay, ngayon ang magandang oras para mag-book.</p>' +
        '<p style="color:#4B5347;font-size:14.5px;line-height:1.6;margin:0 0 20px;">Walang commitment sa unang usapan &mdash; free lang talaga ang gabay.</p>' +
        callButton('Book Your Slot')
      )
    };
  }
  // day 11 (default/final)
  return {
    subject: 'Huling Tawag — Kumusta ang Plano Mo, ' + greetingName + '?',
    html: emailShell(
      '<h2 style="color:#122540;font-size:20px;margin:0 0 14px;">Hi ' + greetingName + ', andito pa rin kami! 🙏</h2>' +
      '<p style="color:#4B5347;font-size:14.5px;line-height:1.6;margin:0 0 16px;">Alam naming busy ang buhay minsan &mdash; walang problema kung hindi ka pa nakaka-follow up. Kung gusto mo pa ring ituloy ang plano mo para sa sariling bahay, andito lang kami, kahit kailan ka ready.</p>' +
      '<p style="color:#4B5347;font-size:14.5px;line-height:1.6;margin:0 0 20px;">Just call, text, or reply sa email na ito &mdash; walang expiration ang alok naming tumulong sa\'yo.</p>' +
      callButton('Call Pearl Anytime')
    )
  };
}

function sendDueFollowUps() {
  var ss = getLeadsSpreadsheet();
  var sheet = ss.getSheetByName('Follow-ups');
  if (!sheet) return;

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  var range = sheet.getRange(2, 1, lastRow - 1, 6);
  var values = range.getValues();
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  for (var i = 0; i < values.length; i++) {
    var row = values[i];
    var email = row[0], name = row[1], day = row[2], scheduledDate = row[3], status = row[4];

    if (status !== 'Pending') continue;
    var due = new Date(scheduledDate);
    due.setHours(0, 0, 0, 0);
    if (due > today) continue; // not due yet

    try {
      var content = getFollowUpEmailContent(day, name);
      MailApp.sendEmail({
        to: email,
        subject: content.subject,
        htmlBody: content.html,
        inlineImages: { pearlGoLogo: getLogoBlob() }
      });
      sheet.getRange(i + 2, 5).setValue('Sent');
      sheet.getRange(i + 2, 6).setValue(new Date());
    } catch (err) {
      console.error('Follow-up send failed for row ' + (i + 2) + ': ' + err.toString());
      sheet.getRange(i + 2, 5).setValue('Failed');
    }
  }
}

// Run this ONCE manually (Run ▶ with this function selected) to set up the
// daily trigger. Safe to re-run — it clears any existing trigger for this
// function first so you never end up with duplicates.
function createDailyFollowUpTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function (t) {
    if (t.getHandlerFunction() === 'sendDueFollowUps') {
      ScriptApp.deleteTrigger(t);
    }
  });
  ScriptApp.newTrigger('sendDueFollowUps')
    .timeBased()
    .everyDays(1)
    .atHour(9) // runs once daily, sometime in the 9–10am window
    .create();
  console.log('Daily follow-up trigger created.');
}

// Base64-encoded Pag-IBIG Financing Checklist PDF, emailed as an attachment
// when someone requests it via the lead magnet form.
var CHECKLIST_PDF_BASE64 =
  'JVBERi0xLjQKJZOMi54gUmVwb3J0TGFiIEdlbmVyYXRlZCBQREYgZG9jdW1lbnQgKG9wZW5zb3VyY2UpCjEgMCBvYmoKPDwKL0YxIDIgMCBSIC9GMiAzIDAgUiAvRjMgNyAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL0Jhc2VGb250IC9IZWx2ZXRpY2EgL0VuY29k' +
  'aW5nIC9XaW5BbnNpRW5jb2RpbmcgL05hbWUgL0YxIC9TdWJ0eXBlIC9UeXBlMSAvVHlwZSAvRm9udAo+PgplbmRvYmoKMyAwIG9iago8PAovQmFzZUZvbnQgL0hlbHZldGljYS1Cb2xkIC9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nIC9OYW1lIC9GMiAvU3VidHlw' +
  'ZSAvVHlwZTEgL1R5cGUgL0ZvbnQKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0NvbnRlbnRzIDEzIDAgUiAvTWVkaWFCb3ggWyAwIDAgNjEyIDc5MiBdIC9QYXJlbnQgMTIgMCBSIC9SZXNvdXJjZXMgPDwKL0ZvbnQgMSAwIFIgL1Byb2NTZXQgWyAvUERGIC9UZXh0IC9J' +
  'bWFnZUIgL0ltYWdlQyAvSW1hZ2VJIF0KPj4gL1JvdGF0ZSAwIC9UcmFucyA8PAoKPj4gCiAgL1R5cGUgL1BhZ2UKPj4KZW5kb2JqCjUgMCBvYmoKPDwKL0NvbnRlbnRzIDE0IDAgUiAvTWVkaWFCb3ggWyAwIDAgNjEyIDc5MiBdIC9QYXJlbnQgMTIgMCBSIC9SZXNv' +
  'dXJjZXMgPDwKL0ZvbnQgMSAwIFIgL1Byb2NTZXQgWyAvUERGIC9UZXh0IC9JbWFnZUIgL0ltYWdlQyAvSW1hZ2VJIF0KPj4gL1JvdGF0ZSAwIC9UcmFucyA8PAoKPj4gCiAgL1R5cGUgL1BhZ2UKPj4KZW5kb2JqCjYgMCBvYmoKPDwKL0NvbnRlbnRzIDE1IDAgUiAv' +
  'TWVkaWFCb3ggWyAwIDAgNjEyIDc5MiBdIC9QYXJlbnQgMTIgMCBSIC9SZXNvdXJjZXMgPDwKL0ZvbnQgMSAwIFIgL1Byb2NTZXQgWyAvUERGIC9UZXh0IC9JbWFnZUIgL0ltYWdlQyAvSW1hZ2VJIF0KPj4gL1JvdGF0ZSAwIC9UcmFucyA8PAoKPj4gCiAgL1R5cGUg' +
  'L1BhZ2UKPj4KZW5kb2JqCjcgMCBvYmoKPDwKL0Jhc2VGb250IC9IZWx2ZXRpY2EtT2JsaXF1ZSAvRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZyAvTmFtZSAvRjMgL1N1YnR5cGUgL1R5cGUxIC9UeXBlIC9Gb250Cj4+CmVuZG9iago4IDAgb2JqCjw8Ci9Db250ZW50' +
  'cyAxNiAwIFIgL01lZGlhQm94IFsgMCAwIDYxMiA3OTIgXSAvUGFyZW50IDEyIDAgUiAvUmVzb3VyY2VzIDw8Ci9Gb250IDEgMCBSIC9Qcm9jU2V0IFsgL1BERiAvVGV4dCAvSW1hZ2VCIC9JbWFnZUMgL0ltYWdlSSBdCj4+IC9Sb3RhdGUgMCAvVHJhbnMgPDwKCj4+' +
  'IAogIC9UeXBlIC9QYWdlCj4+CmVuZG9iago5IDAgb2JqCjw8Ci9Db250ZW50cyAxNyAwIFIgL01lZGlhQm94IFsgMCAwIDYxMiA3OTIgXSAvUGFyZW50IDEyIDAgUiAvUmVzb3VyY2VzIDw8Ci9Gb250IDEgMCBSIC9Qcm9jU2V0IFsgL1BERiAvVGV4dCAvSW1hZ2VC' +
  'IC9JbWFnZUMgL0ltYWdlSSBdCj4+IC9Sb3RhdGUgMCAvVHJhbnMgPDwKCj4+IAogIC9UeXBlIC9QYWdlCj4+CmVuZG9iagoxMCAwIG9iago8PAovUGFnZU1vZGUgL1VzZU5vbmUgL1BhZ2VzIDEyIDAgUiAvVHlwZSAvQ2F0YWxvZwo+PgplbmRvYmoKMTEgMCBvYmoK' +
  'PDwKL0F1dGhvciAoUGVhcmwgR28gLSBCaXlhaGVyb25nIEFoZW50ZSkgL0NyZWF0aW9uRGF0ZSAoRDoyMDI2MDgyNjA5NTMzOSswMCcwMCcpIC9DcmVhdG9yIChcKHVuc3BlY2lmaWVkXCkpIC9LZXl3b3JkcyAoKSAvTW9kRGF0ZSAoRDoyMDI2MDgyNjA5NTMzOSsw' +
  'MCcwMCcpIC9Qcm9kdWNlciAoUmVwb3J0TGFiIFBERiBMaWJyYXJ5IC0gXChvcGVuc291cmNlXCkpIAogIC9TdWJqZWN0IChcKHVuc3BlY2lmaWVkXCkpIC9UaXRsZSAoUGFnLUlCSUcgRmluYW5jaW5nIENoZWNrbGlzdCBcMjA0IFBlYXJsIEdvKSAvVHJhcHBlZCAv' +
  'RmFsc2UKPj4KZW5kb2JqCjEyIDAgb2JqCjw8Ci9Db3VudCA1IC9LaWRzIFsgNCAwIFIgNSAwIFIgNiAwIFIgOCAwIFIgOSAwIFIgXSAvVHlwZSAvUGFnZXMKPj4KZW5kb2JqCjEzIDAgb2JqCjw8Ci9GaWx0ZXIgWyAvQVNDSUk4NURlY29kZSAvRmxhdGVEZWNvZGUg' +
  'XSAvTGVuZ3RoIDg4Mgo+PgpzdHJlYW0KR2FzMV1nSjZLZyY6TzpTYlohJmRaSkdEM1ZaSTs+JyFxXHAmKGhgWlxGRzg2VGE3Vj5ocUBaTCJBMjMxcXM8RjdSQFE/UiJyLihnNSlVMzcsX24kYyRsRmN0JVtcTFNuZENpR2ckYWtyNl4+JkVRck1Tb1MmYSxXQVIvaF5q' +
  'Oz5wRy4salM6LEs8VzQsR09fTTFfO3NAZHFsQUgoZTpOYCo2KmlhTTAwUW1dWWhyTWBvM0ZpQkpaZiZfQDlzQSJPZjgnRSJmWi8sLUJkOz91YGQhLCpuLE1ea3BcVihPNDctTVcmPSJOaTdhVyxBXS0zTSU1Xi89TlAzKWAlKDBjMFNYQDRSKnNXLUB0cmBaJ1xPWjxq' +
  'azxxb2ZGWStzTj1GakcqQjs1P2tIcjJUQnUoLCwuVz07K2clQWtXZSI+Z1wtMy9NckFzOzlAJF5ncWciU2pebCVnIVgnJFomPTs2dUFYdGY+W25AWFUoISkxTEQvb1Q6QV45WFI6STtlNlRKVzhaXCw3QEgsOiFfJ0JSUCpiXk08WDJlTW80J2UpaVpEZ3BrPm9ALSgo' +
  'Q0VdWEVlZVJtNUk0J0IzMFU6QyRNQSNCZFlUNiFpPjZxUD5tM2wuMm5sPj8jQW9PPmdPQXRGUUpLK1c+W0kzZWdxUGhpLmxqcHJyT2o6OFssMFtOJXMoXzwhLDU3byJpV3ExWWVrLT9lLCwwPDROczlpXjdKcEY8P0xgWEtGZj1BVV1pQHNxSShAJEUwQ2tMJEFgTkRO' +
  'RHA+PlJVVTljNGNqcD8hWSU7KTd1Mj1lSmdkNEY4bS9CTUJUbGhrNlpYR15gaGAhWC9MTGBPKV8vMSYvU0wwQyNhJVQ0IkVZUilEPiQpVUFeWlAiW2pgMyolNnI5TTxoJGBcW1habWRkSiMxTTQjWmJTXTBlMjpJISJPSkBaL0I1UXA4RWdvS3JgMEldcW9QXEUiakJy' +
  'UEg1XFE4QXAyclo3Jyluby5NO282VSlaSXRnVWRXZzgqPjVQaUJwJ2xcLi4qJmRTPVxFcT5sREAzK0MmPVpZQmpwN25Bb1QyWGdXJFNBPT1rI3BgVWRaTE02Lk9SbTx0NmBDRDhHbnMuYTQnTUR0aWhZcD0hdENQbDpxYHJMXENBXz9danJBXHIyOWchcFQwLllJKDAh' +
  'c1cuaH4+ZW5kc3RyZWFtCmVuZG9iagoxNCAwIG9iago8PAovRmlsdGVyIFsgL0FTQ0lJODVEZWNvZGUgL0ZsYXRlRGVjb2RlIF0gL0xlbmd0aCAxNjI3Cj4+CnN0cmVhbQpHYiEjWzk2OGlHJkFKJENscXRrbSRqIihoQz4/KFg5VXArTldvSElxIiI2R0xhcC9XMk42' +
  'PXRHSSE3a0tWSU4zIi1fN2k3OCFNKUNpUy84bUBjNjopXGJCWUVFNSRqaFFPRl5kYD5Wa0JLczgoPU1vRkI0MUc7RD1KOylvbSQnMnEzWUA2TCkuQEIrckVVIzguLG9IcTRASyQsaixIOkhwKy9MRTJDXzY6NzwkUjVaUk8+M1tvQVdXbDk9J143J01WJjhpRXVfMD5c' +
  'RylvRi5pYVkrJSpzQ0Njay9JVVciTD00WzRXaCVDNlFdWUM9LTlmQFM+Vm5KYSROUDtKaj8/VFc8OztEMyhhcidVL3BAaS0oJCRxIltzOklJYkhATyRrTSRAJnRAOWUuVTJeIjxpTmNHPkVvby1UdHJFQW1KWl4/RHA3Pl9RJjcmVi0pJzc1OTo9cnE4M1NXXlxnPEth' +
  'clViYUNTTCdnSjMwLy9BUjNQNHAoUV8wMjZeJyJvJVUkJkNfckE1bnA0T2FvdE5PWTZdQGNzLl5cV141UkRBNEBDVE9XU2sxPTpSaWRDSkg4JEdyJS5DJC9CbTZyYUYvOTFkJkxmVVohMVkmNFQ8J25LclZlXlhzW2tOXGRXJi9MWyE8aC1tXDs9MWY4KjsqW0BrTTJU' +
  'dHNfXTVkLShTZyo6N1d0LWk/YCZBX04qLl5uITBIUEwqJyZfZmgkPi9JcWQtc2ZHSFZCW1ZEUUE0JmUsNWYtTXQkJUdRcDN1W2NZIXEoKS9FVWQzPy43JlRdYmpAXzxfbTxePzxXWGgtIjQwUG5qZ2IqZ0BDaXMnKTlxLkhWaSttQ1guSDVSRSpOVEY+LCFgZVMtNyZe' +
  'VjYoMVgpcFNXWmtCUGZVc0JFbmM/TGgrWm5ic2BYZkp1blYnOjpvNTE6V1pFJ05iJ1peKHNYRVdISiFNVW0qXiY8KCJJb2duQUpeZFEtW043Q3I5OFtATW9FQT5zRkBOQEMlPkAuIi8obls4O10iWXBYI28mbkgzSztcPjpzZ3QiXjI4ZmxcPTJ0MWInW29bPElaaD9m' +
  'YFAqKmxqQE04PSZSNWlSZ1JzOGZTSl1XWzFuTFdfYl1iZihNVmktNjBsRipvLVZbaEhfIUM3RT9iM0dNbyMpb2chXE41MmpTU0JPREBLVkRiW0FmUltIKE1bT0ErcEZhMyVOQW5XV088L1A6OVxuLnVdWU0namFCXidNYTBPPm4+U3JtVCNPW25bYjRWIjdbQitGYDBW' +
  'KGFkKlxjbjEiaEErXEVRU0dDKm1OQjBuSVRIa1slIihOLSFsU1JdMm4xOSpeJ1EwNyxlTmg0NiQ1L2ZZKTpXPDIoIi1FcVYxSkU8SkVfQmFfTFVOREsiWmNVXlBGZTkxLmQ/Wks3J00xO0VuO1JMMSJLMSUnLiQ8dFtbRk9CMWBVOl4jRydYcl8pOkppIT1TQHMsMERp' +
  'N14/J2hkJ2FmXylXbWgqZUE+WDhXWXUydSMzU1xyKk45W3Q6KCY7VTlFJE40dFM+ZSRCXiRMJjxDSWczTl4xWnUxdFo4LkZxTFtUMWRzaE1oJl44NCxyLW9GUzZpQ1hIL0wkITo9J1VwKXJnJ3Bda29qW3A7X1UxPEBsTyVpPjE+LkJWbUVDT2xDXzN1OlA7Xi9vOkRK' +
  'bGFXL005ODMkOSdtQEMqWF5bW00/O01mdC91SiszK1RscEA3KmQkW3IlXilLLmhaNzpEYjk1dSVtPStGWTxEOiZ0KSJHPTRoJzNFMGNKNyZbT0VdM1tBKScmWFNSY2pWP1JAM21LViVjTDx1SjxlY2MkP2tWSy5vP1MtVmg6OW4hcF9iJD5oazMiKWVaWjlJPFRGNm8v' +
  'KGFiXmxBbyxIaUZ0VU8qRkdBR2xQQzxGLz41VWlkLyxNMiwqYzhjcSMkVV9dRFotXGs5SigvZEhCO0RpJFNSckIsP3RbI1RCXDRCYXRrQy1DSD8iWVssZ1lTQmNHaVZLdSMvKkAxXXFxXGxIS3VQXFs0My0mR00nXUJqXDgoJmItJGE3JnIiIiw6MmhRPSZIJVYrSHFA' +
  'ITohUGRtRGwlXmFXJlVKODprVzxfP3M3Ikw/R2k0Y19LYCZFcWwoI0UnWiNEQjRkPkE8dS4vUm8wc2RjcihFJ0AtUllYczVZQn4+ZW5kc3RyZWFtCmVuZG9iagoxNSAwIG9iago8PAovRmlsdGVyIFsgL0FTQ0lJODVEZWNvZGUgL0ZsYXRlRGVjb2RlIF0gL0xlbmd0' +
  'aCAxNzg0Cj4+CnN0cmVhbQpHYiFrdDlsbyZJJkFAc0JtJjs0Qiwob3FGSWU2VERROUNcQUEmWyJFTFQxVEhKZz07QFRgQVYuRm8oLjEhNidiTyxJT10nRVE1N0hPcE0zQkxQT11wJFctP15RYihMIiM8M2FBUnJccSRfMD8vQCs5QEVTQDUnbkFHWFJdU243X2tKTS0p' +
  'RSVuMm9pWjhJVG9vPDRMbTElWjFsJz4vOUxUZDVzRy5NbkVAOSIvMGo9X1YtNi8qbEk3MC1wSm02QWYtQWdKNVlfUEQ2KnA2J0tGKXVAbUkjR2pxRzFTTEAnKWhNT29TWjdVXGojKHJlUlg3WT9ubzk9VkpxTEBPXmRJViFsZGdAMlM+Tl4/RWNERWROKW8yLypsUkBR' +
  'IztnazovIzZaVUVmNkU9USotT1dlOVUsPXE7NFszP2A4NkUmU0BeSHB1RC83Xmc/MHFfbTVxYUZKXl9WL1ltZ2AtSyhOOnU3P0RKMkNwKG5vWUIkdW9cUmdKYi03clVcP3FaQSsoUkdbVVtwVmpVQERdJjFwQDJyYEBoZlprVSxXbEc2J2hIQHVBTCVSdEtTJkx1L2Vn' +
  'dHJNXU5LNUo5NicuakU1MHVGTWlXU1klPWJIOyRfIz4+YzAuTkFZKnQyT106R0UyNzYwVCtebVtsW2BbYjdyKVJiJUMvK0Y2ckpGKCM0akNgWCYqJENdK2llRCVwOyQoK29mM2RrOHBucj8maHQkcSUsWylDY29HJD1RL2MmWT9HaGN0PUBrKzJVTTgodGdWIldXMDBv' +
  'Ykc6Xjhwa01pKEJ0Wk0+aEIyc3FWZkJWIis2KEsxZWBbaWg7YTBOREdJV19jWChqKVlBcyVQKT9dWnNZa0BGdFtGIXBlaGxYNCg7UFNpJmRuZjlVMW1VUGM+aVttJiZBNGghQjdfU3NMUj5pLkJrPiMkSyJOWUhAIVFrRktsbkVsQlouKmpaPClaWC41WVdFc04wZWs2' +
  'PFMja1RGN21CQCtiYzZcJmshSi1lQkNTPCxySFAmW1RKcSxfNzRQLi5SIm1TKmBtJ0AkV19ebEwmTzRlWkQpQ3Q0LiZJdSdJLE1wJTVra3NfXUZeWEN1XCVSVEclKVI3KVNsIyV0JHBSKEJkIzRFRmArJz0rUjcqWzxgWnIzJVEzNWYjWDBPVlAnSS5STmRdc0VfXDVe' +
  'K2tQOC05WURYWk9oa288OFhZOzVIajAhZTVGXUBIMEhYJmMqXUI7TUxccygkRkY+LGBDdGhsb0EnIk9eXDIhNCo8O1NCMkpmb2gqI2phT0wvUzNnL3RtZyI5ZHRDMFRSSkhuVCdYKTtoNEFHTShzbjU0TTxBP19hITwnIlk7RWY5Tz9Ua1dIYT0iOEIqK0o8QkdUUV4s' +
  'IkRicUxgNm4uWShWXGllJjRqP0ciZk5WK1lcYydcTTNfXlZtI0lBRG1zW29JbCkxaWI7bF4tLCJRY1svQ28pWEMxcmkwJ0dEUGhTJDktMShLUTZFXFsoaSFpck1CP2VPIS9lR2ZTRW1cIT0xKUYic0NNQ3RYXjxkZ2NZWWhbLENuZUIsYCJZUjI2JUFDdHFXZC49SCJG' +
  'NUJiSlpcWiQoZD9RaSNDJ2JDVy4hL3BkajROS1Y2aGRQYmxmXj1EcDQ6JHJyUSNWPCs8dDBqOlpjMFhnPHRqZW88UG9CcCY/JlU8N24ubSJUYSdVYSEyJGpXLlZlUVBXV2VKQ0RCcl4yLCg2PWNiVm5bUG5fP1QpOCEqQkFnOygqMCwnWzZkVkxyVGNiIUVyNmg2V1Br' +
  'WUcvNSswP0o7ZzdoP2lgSVFDXC4saUBcXUtgTVNnZCkpaEZGLDtEXUJOMzJua1hoVUgqU280ZSFKIl8qLnNUI203S1JGM1syXm5YQHIvZnNsLD0yTFJVclxrNDdUPjdTTUImK2ctMHEiUzVXN0FhJVxAc1UrLFckMjtcY3FYMTBtRmpRZEZpYyNZJ1c3b1VIZCkkLjxR' +
  'WytXOjVNLi8kaTo2STlINCckTW9YYDxVQ3AiJCJMKDljYTZ0ayxda1kzJS8lIVVnJ1pxRm4zXFNVKyVRIlpaIXBia0wxLlcjMGBVVEpcJUddPTQ2PUdlW0c1JSokbS1YRlsuaTM3WWwtPG8mQGFxKEo9Q1Y+N21KPC9ZcjtjKixtc2t1UFs9QDxYaWhMJU8vSVghbUdZ' +
  'VF0kaFxLRTIsREVJMFlpaVlSS19WWkBCcyZZPm4sJERxaj11aEkubmlcNThLNihRKz5YQk11WSRhImMsMkVycj9dUTZcaEpsZD45SEVsaGFqbCstST1hTiYlNkFYRic0Lj1OQW1IKW1gR1JYUmgqLjBBNmRObFU0WnIwK0VEQEFaODgpVzJCQipPKD8sVGhxZ0BpN2Z+' +
  'PmVuZHN0cmVhbQplbmRvYmoKMTYgMCBvYmoKPDwKL0ZpbHRlciBbIC9BU0NJSTg1RGVjb2RlIC9GbGF0ZURlY29kZSBdIC9MZW5ndGggMTg4Nwo+PgpzdHJlYW0KR2IhU2xnTihiNiY6TzpTb1tCLCJAUlcna2gwQFdiKzldIVgrbyNvXCVySFRSS2xvYkxKPy9EKFtz' +
  'S0FcMTMnclBVbCkxc2MpVTstcFItKyFqcDgzVT5GPDAmIzRRWENhKTsoZCQxZ3E4UGJoYzohTyhbTTAsI2lFUFRwbEVUZUJbZGRdN0VVMFJ0WEVqUTxzQkxcc3Q4VjtdbnBhVGsiPXFtSUZIQCM4ZCUtLSVCXD0tQGhtamIvck8rMSRQcSNzaGVvaE9FZShja3VwW0pl' +
  'Ly1UQScjYzFYYyovb1kiXVtbY2EyczxqciRpRz9fOlMvXnRHQCtAL18mK2NacUoqTlA1WD0hV3BQJnA/WzUkS0ZpZnElNFlvdHJeLik/KWRNWC1hQ0AyNGwrR0Nnai1GPT5UcC9yMWgwal0jPlZAKERAcGFXPDQwRmg2Pj4zclw0Tj1gIVFmaSNOLUhTIScmb3I2LmRh' +
  'OipNbD1UQj0nRmxRWUg4dGcrPFkuZ0JGYHFuSVItTDhPYTdUTHBwLFFfMF1iOTs8cEhwJjReSHUrdGYtL1hHVi9USk5bP1VZckBLOzM6NDdxcC46dVRWc2RQYFVxT2xYJ1VsNFUtZ0hHQEs8LUUuXnBnI3UxQFFdPl1NJ29daDhYP2hoaEYvVFEmSUE1KCg8Xj1KcFgw' +
  'dTBFXXBaKmFlb0RfWl9fREl0NCMtO0JLQXRQKTVlK0phYDFHZFJiSXJIOWUlWjxxLkk9X0ZdbjpLZWYtKlY5Xzc6al8pLk0jLFRrRjhCSHReXEVydHEnSllkdDNGTmsoPSgzNSlETmlZMFs3VjZjdDMtdShTRDpLKz42RStVLyU3R2ItMmxYdEZnSS8iMjo3b0E8VyIs' +
  'bG9PbklAK0pBJz1BO3FRKCM0L0NzcWk8cEhePF5vSllvMVElNGg/Om1hVHBYXS1CLGtSWDdXU3VlNms9JlZqOWJBLSUidDVcdDhYJEg3b0AqTypsMDgtQikpJTo9UkoubUwjNDVkPmBTZ11tXFg7RDlHYnEvTC5yOkBtI0FpPGpAc1QoaF1cdUlRM1twTyNDXzI4LGFO' +
  'ITA6VnFGJFk4Ymo9PUtVNlA9L3VeITZULClfLjwsSDBlXFArYFU6Zyg3QSwtLkg/Mis0NEtwU0BjZlhTTk1IOW5jRkg5YFo+WVJSMDw2Oz0hTUVNay0nQWRbRWY+QThSMyMsOnJNSTotIkRiVWBkNkhEQD5JPygtOElPRykrUnVZYVxlbFIqTSVTcSRacyImTSViYikw' +
  'UGRkSlVtQm9eW1ZhX3JNPDQ8Sz0zK29WOVlFciZbdGNXIlgjQ1VkTDIjRWdGZEghUmowc21BI2JUNTZwRGsqPF5qSGY7NVFvczZBUShML1lSODFVTUhaWG1DTSxYcnQ2OFU7bkQpV2tCNnVCby1HLGs5SkwucGxTXjhXLmA1OEwpcGZtKi11ODIubjlkUVlFXGI9Tj5F' +
  'aF5tVHRKV2lmLVltcU1gUlAvVG4hPUJOKW5OQ1osLixNZmQ/Zzc+Py02JTpuTFdRUV1gRGpfQk43YzImcDBYSD9bKmEjbTlkTmpHQE1PUUtkTjhcRjo5YyRiR1NRRERwQGQmJCMyR2lxYS05RloodFU1RzU/LjwnYzZPaVdoU1NkWFhvPUtoJTg8O21xS0RHRlhNLC8r' +
  'dUZNLDQ5I0QwY2I6MSdiRmY/RGBfT0dxMls6TV4+XXRnVSUsLWJSc25dXWZBaXNHMnJESCliXjU1UDwmYTFVQSdtIi1FbF9pSTY+a2VpTWNuYmVQUXFZOHB0XUp1RVMwSHNVPj4ldTVaaVQlaUtLP1ImIThCWkUiQkw+SDNDZEZEM2ghW0M3IXNAaHVWPjZkZVRLYl4z' +
  'NjtoTS1NUjBGdD0kSGReWkVZTUlyYHUsVXEsVl8wXiE2VWVIUClKU3QlViNwK0ZOW1tFLjcxc1ktNUwpLidtUFZsJUs+PkZeQ2UhcGNqZ0BYclxRRjhMaGU0Ilc9UE5fIUdlQV5zTDhmK1dIRmg9PF9TJGVxclNMMEtgNDpkXz9dSSY/I1hKKykmWFkiLkhLNz5uVydw' +
  'SDZdV0VmcjpaXFZJWGtwPiJjRFJKMGtdQW9WWFcvdExmKiowanVTaldVJTg6ZUhRcWtGOj1TKWROS3FTOWdRaWExTT1Ac2FGRSs1PDdMOCRea1Fma3NrcWVsNnVTZ3VNMCM/STg7LDVBNjBUJ0RlKDJYX0cjSyxxNG5wRDQiO2hlLGVqIjNLSjM5RkFWW3BhUFwrNUtS' +
  'RnBaKltRR0leKUwoT2o4VlMpPUs4WFcmJEdxN0BTQjRESFNDTDM3bDRlITZPMmJfV05kRiw6MydnamAmK01VRHIiTilXbkcqUERiQTIwK21zN1duKidOO2AhU1gnLCdaRHAvQ1VaW2IjI3EpZm5AQidZTkRILWRab29GbmNKRUlfRkxwXkshOFZEVnNQc24pdVY2TCVC' +
  'RDxTRylRIi5DTzY3XVRtV281SFhRQ3RCQ081Vn4+ZW5kc3RyZWFtCmVuZG9iagoxNyAwIG9iago8PAovRmlsdGVyIFsgL0FTQ0lJODVEZWNvZGUgL0ZsYXRlRGVjb2RlIF0gL0xlbmd0aCAxMDEwCj4+CnN0cmVhbQpHYXQ9KDsvYW87JjpYKU9cPGltRVhpPk8jLVtD' +
  'O1xnO11wWzBTa0NER10+TW0lOEVDVi06PSdsajEwNlpPdHJDTz11Q0pvXUM1MSVxcCM3JklSU01ELnRGcjdoSFVDISchY2lxTUNIVmFpJCtaZ1InOERFT1xpakE9REYsXFdcZEtiQlNxV1dtS1Q2QTwnb1gncmNpSFYvai84VzhVdVpTUGZeMSNYPGtgST0tUEhyXD9S' +
  'O1o2RC8kVDZyUTVPcUxtP0QjU0JzbVFsSyNBRiJwWGYzP2xKXzBWMVA8SydDPTZkbl9vQXAjLmM9aF1ZJy5DVEl1WzQjZDZJZGZHTzAlOFI3XFIxWilpIVVwWz0uXnNUW1JiQVFzXG8+QissQi43PlBZKTgrb18kNCVCVG5JTzsoU2FAOExVRUY3S2VhN1wmSV8xbS5x' +
  'JkE5NWY1YkBfaFNoYkVsNT5CdV9yLCZSZTI2KnRgcE8tJklTJkZQKXE5VyNjZTlacTFcWzdEVE86LFdtdDw4aSNsZCxZTGsoVHNJR3M9I0dBaDE0RGgoITdKajhSKlVGWEIxPkg2OjVaWFRoRExlMUQvc0BJJ2U8S2gvP2AtTVJgNktxX2tdb0U7L1A4V08vdG9mNDdj' +
  'Uis6KS1EdWJdbkZqRz1DYmlbSV9PTHEwPD9uPE5fSCM2LlJQMzRpK04tQUttdXRtP0w2QzxLQWlANmFPR19hUE1sITNnZj4/NylUMDlYWjhEZ1ZBXy4lY2hCJVNedVZrYyQvWW1uOll0OSFfWklPbEs6YSxESitrNVlrNkVLNEpnbnVZZGwzYSQ+KDNwckEhI0ApSV1A' +
  'Vik4SGs9dE9aIkMqTEdVQCdLZE1SL0kxWk1YSFYuYENoWUs7QTkrMFVuZ25HWE9oNV4xPFklbUBZZCdQdEllY1E2LiwmMm1pZUY1RjNRPyNQVmU2RGJZZik6Wz9aTz42YFgjYVRpTylaa2pWSkFlPzFNdDtlbDBrZHBUSUBZUSJCTXR1UU0hL0tYRDcmJ1VOVFhdXi0p' +
  'TU9pcWltI1knNG9UUDI0aExDVVwqZEMjLjs2WU1JKDhfUlkoQzs6VmooQk9mZiZRclJGI1JwUSJtM0NoKjJcYXVOWVUjWltGX3U/XVFcTSpoP1tMXkFuKiUsdStFU2IiVURSWCYtRE1OQWRJKUE3alZCO1ghY10tUzpmUlszX0tnaVExRlgoRTBpQ1M0JShRWj9uVjZC' +
  'J1MyXDwhZXAyOD9yQkBmODFIJTM0c2lGJHMvZ0w4WlRTK15MTlsjPT0wSUQxczUhbCE1Kz5XZk4uJF9MWTQ9MkY3LUpxNSw1cXVWNT1cXy1+PmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDE4CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDA2MSAwMDAwMCBuIAow' +
  'MDAwMDAwMTEyIDAwMDAwIG4gCjAwMDAwMDAyMTkgMDAwMDAgbiAKMDAwMDAwMDMzMSAwMDAwMCBuIAowMDAwMDAwNTI2IDAwMDAwIG4gCjAwMDAwMDA3MjEgMDAwMDAgbiAKMDAwMDAwMDkxNiAwMDAwMCBuIAowMDAwMDAxMDMxIDAwMDAwIG4gCjAwMDAwMDEyMjYg' +
  'MDAwMDAgbiAKMDAwMDAwMTQyMSAwMDAwMCBuIAowMDAwMDAxNDkxIDAwMDAwIG4gCjAwMDAwMDE4MTYgMDAwMDAgbiAKMDAwMDAwMTkwMCAwMDAwMCBuIAowMDAwMDAyODczIDAwMDAwIG4gCjAwMDAwMDQ1OTIgMDAwMDAgbiAKMDAwMDAwNjQ2OCAwMDAwMCBuIAow' +
  'MDAwMDA4NDQ3IDAwMDAwIG4gCnRyYWlsZXIKPDwKL0lEIApbPGQ3NjUyNjg3OTlhNzE0Njc4YjliZGRhZWUzMmQxN2I5PjxkNzY1MjY4Nzk5YTcxNDY3OGI5YmRkYWVlMzJkMTdiOT5dCiUgUmVwb3J0TGFiIGdlbmVyYXRlZCBQREYgZG9jdW1lbnQgLS0gZGlnZXN0' +
  'IChvcGVuc291cmNlKQoKL0luZm8gMTEgMCBSCi9Sb290IDEwIDAgUgovU2l6ZSAxOAo+PgpzdGFydHhyZWYKOTU0OQolJUVPRgo=';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    if (data.type === 'leadmagnet') {
      return handleLeadMagnet(data);
    }
    return handleConsultRequest(data);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * ---------- Lead Magnet: Pag-IBIG Financing Checklist ----------
 * Emails the PDF to the visitor, and alerts Pearl of the new lead.
 */
function handleLeadMagnet(data) {
  var name  = data.name || '';
  var email = data.email || '';

  if (!email) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'No email provided' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var pdfBlob = Utilities.newBlob(
    Utilities.base64Decode(CHECKLIST_PDF_BASE64),
    'application/pdf',
    'Pag-IBIG-Financing-Checklist-PearlGo.pdf'
  );

  var greetingName = name || 'there';
  var htmlBody =
    '<div style="font-family:Arial,sans-serif;background:#FBF8F1;padding:30px;">' +
    '<div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;">' +
      '<table role="presentation" width="100%" style="background:#122540;border-collapse:collapse;"><tr>' +
        '<td style="padding:24px 12px 24px 28px;width:52px;vertical-align:middle;"><img src="cid:pearlGoLogo" alt="Pearl Go" width="46" style="display:block;border:0;"></td>' +
        '<td style="padding:24px 28px 24px 0;vertical-align:middle;">' +
          '<h1 style="color:#E4C878;font-size:22px;margin:0;font-family:Georgia,serif;">Pearl Go</h1>' +
          '<p style="color:#ffffff;font-size:13px;margin:4px 0 0;">Biyaherong Ahente</p>' +
        '</td>' +
      '</tr></table>' + +
        '<p style="color:#4B5347;font-size:14.5px;line-height:1.6;margin:0 0 16px;">' +
          'Attached na sa email na ito yung <b>FREE Pag-IBIG Financing Checklist</b> mo &mdash; complete list ng ' +
          'documents at steps para ma-approve yung housing loan mo.' +
        '</p>' +
        '<p style="color:#4B5347;font-size:14.5px;line-height:1.6;margin:0 0 20px;">' +
          'May tanong ka ba about sa requirements, or gusto mo nang mag-book ng consultation? ' +
          'Just call or text us at <b style="color:#122540;">0970-149-6420</b>, happy to help!' +
        '</p>' +
        '<div style="text-align:center;margin:24px 0;">' +
          '<a href="tel:09701496420" style="background:#1E4B3A;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:100px;font-weight:bold;font-size:14px;display:inline-block;">📞 Call Pearl</a>' +
        '</div>' +
        '<p style="color:#8a9080;font-size:12px;line-height:1.5;margin:24px 0 0;text-align:center;">' +
          '🤝 Honest Service &nbsp;•&nbsp; 🛡️ Trustworthy &nbsp;•&nbsp; ⭐ With You Every Step' +
        '</p>' +
      '</div>' +
      '<div style="background:#E9EEE1;padding:16px 32px;text-align:center;">' +
        '<p style="color:#4B5347;font-size:11.5px;margin:0;">© 2026 Pearl Go — Biyaherong Ahente. Cavite & Nearby Areas.</p>' +
      '</div>' +
    '</div></div>';

  MailApp.sendEmail({
    to: email,
    subject: 'Your Free Pag-IBIG Financing Checklist 🏡 — Pearl Go',
    htmlBody: htmlBody,
    inlineImages: { pearlGoLogo: getLogoBlob() },
    attachments: [pdfBlob]
  });

  // Lead alert to Pearl (plain text, lands reliably in Primary)
  MailApp.sendEmail({
    to: PEARL_EMAIL,
    subject: 'New Lead Magnet Download — ' + (name || email),
    body:
      'Someone downloaded the Pag-IBIG Financing Checklist!\n\n' +
      'Full Name: ' + (name || '(not provided)') + '\n' +
      'Email: ' + email + '\n\n' +
      'This is a warm lead — consider following up.'
  });

  // Log to Google Sheet
  logChecklistDownload([new Date(), name, email]);

  return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * ---------- Consultation Request ----------
 * Sends:
 *   1. A thank-you email to the visitor who submitted the form
 *   2. A lead-alert email to Pearl with all the details
 */
function handleConsultRequest(data) {
  var name         = data.name || '';
  var email        = data.email || '';
  var date         = data.date || '';
  var time         = data.time || '';
  var message      = data.message || '';
  var situation    = data.situation || '';
  var propertyType = data.propertyType || '';
  var goal         = data.goal || '';
  var timeline     = data.timeline || '';
  var budget       = data.budget || '';
  var location     = data.location || '';

  // ---------- 1. Lead alert to Pearl ----------
  var pearlSubject = 'New Consultation Request — ' + name;
  var pearlBody =
    'You have a new consultation request!\n\n' +
    'Full Name: ' + name + '\n' +
    'Email: ' + email + '\n' +
    'Preferred Date: ' + date + '\n' +
    'Preferred Time: ' + time + '\n\n' +
    'Survey Answers:\n' +
    '- Situation: ' + situation + '\n' +
    '- Property Type: ' + propertyType + '\n' +
    '- Goal: ' + goal + '\n' +
    '- Timeline: ' + timeline + '\n' +
    '- Budget: ' + budget + '\n' +
    '- Location: ' + location + '\n\n' +
    'Message: ' + (message || '(none)');

  MailApp.sendEmail({
    to: PEARL_EMAIL,
    subject: pearlSubject,
    body: pearlBody
  });

  // ---------- 2. Thank-you email to the visitor ----------
  if (email) {
    var htmlBody =
      '<div style="font-family:Arial,sans-serif;background:#FBF8F1;padding:30px;">' +
      '<div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;">' +
        '<table role="presentation" width="100%" style="background:#122540;border-collapse:collapse;"><tr>' +
          '<td style="padding:24px 12px 24px 28px;width:52px;vertical-align:middle;"><img src="cid:pearlGoLogo" alt="Pearl Go" width="46" style="display:block;border:0;"></td>' +
          '<td style="padding:24px 28px 24px 0;vertical-align:middle;">' +
            '<h1 style="color:#E4C878;font-size:22px;margin:0;font-family:Georgia,serif;">Pearl Go</h1>' +
            '<p style="color:#ffffff;font-size:13px;margin:4px 0 0;">Biyaherong Ahente</p>' +
          '</td>' +
        '</tr></table>' +
        '<div style="padding:32px;">' +
          '<h2 style="color:#122540;font-size:20px;margin:0 0 14px;">Hi ' + name + ', thank you po! 🙏</h2>' +
          '<p style="color:#4B5347;font-size:14.5px;line-height:1.6;margin:0 0 16px;">' +
            'Na-receive na namin yung consultation request mo para sa <b>' + date + ', ' + time + '</b>. ' +
            'I-cocontact ka ni Pearl as soon as possible para tulungan ka sa property journey mo.' +
          '</p>' +
          '<p style="color:#4B5347;font-size:14.5px;line-height:1.6;margin:0 0 20px;">' +
            'May kailangan ka bang i-ask agad? Just call us at <b style="color:#122540;">0970-149-6420</b>.' +
          '</p>' +
          '<div style="text-align:center;margin:24px 0;">' +
            '<a href="tel:09701496420" style="background:#1E4B3A;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:100px;font-weight:bold;font-size:14px;display:inline-block;">📞 Call Pearl</a>' +
          '</div>' +
          '<p style="color:#8a9080;font-size:12px;line-height:1.5;margin:24px 0 0;text-align:center;">' +
            '🤝 Honest Service &nbsp;•&nbsp; 🛡️ Trustworthy &nbsp;•&nbsp; ⭐ With You Every Step' +
          '</p>' +
        '</div>' +
        '<div style="background:#E9EEE1;padding:16px 32px;text-align:center;">' +
          '<p style="color:#4B5347;font-size:11.5px;margin:0;">© 2026 Pearl Go — Biyaherong Ahente. Cavite & Nearby Areas.</p>' +
        '</div>' +
      '</div></div>';

    MailApp.sendEmail({
      to: email,
      subject: 'Thank You for Your Consultation Request, ' + name + '! 🏡',
      htmlBody: htmlBody,
      inlineImages: { pearlGoLogo: getLogoBlob() }
    });
  }

  // Log to Google Sheet
  logConsultRequest([
    new Date(), name, email, date, time,
    situation, propertyType, goal, timeline, budget, location, message
  ]);

  // Queue the Day 1/3/5/7/9/11 follow-up email sequence
  scheduleFollowUps(name, email);

  return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
