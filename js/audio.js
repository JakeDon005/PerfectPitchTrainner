"use strict";
let ctx = new(window.AudioContext);
let bts = [];
let oses = []
let mode = null;
const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const osty = ['sawtooth', 'square', 'triangle', 'sine']
const channels = 2;
let range = [4, 5];
let rnote = [];
let pnotes = [];
let ifst = null
let gainnd = ctx.createGain();
gainnd.gain.setValueAtTime(0.5, ctx.currentTime)
gainnd.connect(ctx.destination)

function frjs(n) {
	return 440 * Math.pow(2, (n - 46) / 12)
}

function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function P(fr) {
	this.fr = fr;
	this.init();
}
P.prototype = {
	init: function() {
		//振荡器代码
		this.os = ctx.createOscillator();
		this.os.frequency.value = this.fr;
		this.os.type = osty[getRndInteger(0, osty.length)];
		this.os.connect(gainnd)
		//随机波
		/*
		this.frameCount = ctx.sampleRate /this.fr;
		this. myArrayBuffer = ctx.createBuffer(channels,
		  this.frameCount,
		  ctx.sampleRate);
		for (let channel = 0; channel < channels; channel++) {
		  this.nowBuffering = this.myArrayBuffer.getChannelData(channel);
		  for (let i = 0; i < this.frameCount; i++) {
		    if (i < this.frameCount/2) {
		      this.nowBuffering[i] = Math.random();
		    } else {
		      this.nowBuffering[i] = Math.random()-1
		    }}
		}
		this.sourcel = ctx.createBufferSource();
		this.sourcel.buffer = this.myArrayBuffer;
		this.sourcel.loop = true;
		this.sourcel.connect(ctx.destination);*/
	},
	play: function(a, tp) {
		if (tp) {
			this.os.type = osty[tp];
		}
		this.os.start(a);

	},
	stopp: function(b) {
		this.os.stop(b);
		this.init()
	},
}

function crtBts(range) {
	let l = range[1] - range[0] + 1;
	let o = 0;
	let p = range[0]
	document.getElementById('area3').innerHTML = "";
	for (let i = 0; i < 12 * l; ++i) {
		if (o == 12) {
			o = 0
				++p
		}
		let text = p + notes[o]
		let b = document.createElement('button')
		let t = document.createTextNode(text)
		b.appendChild(t)
		if (o == 1 || o == 3 || o == 6 || o == 8 || o == 10) {
			b.setAttribute('class', 'B')
		} else {
			b.setAttribute('class', 'W')
		}
		document.getElementById('area3').appendChild(b)
			++o
	}
	bts = document.querySelectorAll("#area3 button");

	for (let i = 0; i < bts.length; ++i) {
		let x = bts[i];

		oses.push(new P(frjs((range[0] - 1) * 12 + i + 1)));
		x.setAttribute('index', i);
	}
}
crtBts(range)

function judge(pns) {

	pns.sort(function(a, b) {
		return b - a
	});
	rnote.sort(function(a, b) {
		return b - a
	});

	function a() {
		for (let i in pns) {

			if (pns[i] != rnote[i]) {
				return false
				break
			} else if (i == pns.length - 1) {
				return true
				break
			}
		}
	}
	if (a()) {
		document.getElementById('area3').style = 'background-color:green'
	} else {
		document.getElementById('area3').style = 'background-color:red'
	}
}

function play(event, el) {
	let i = Number(el.getAttribute('index'))
	let subj = oses[i];
	if (event.type == 'mousedown' || event.type == 'touchstart') {
		subj.play(0);
		if (mode == 2) {
			if (ifst) {
				pnotes.push(i)
			}

			if (pnotes.length == rnote.length) {
				judge(pnotes)
				pnotes = []
			} else {
				document.getElementById('area3').style = 'background-color:none'
			}

		}
	} else if (event.type == "mouseup" || event.type == "touchend") {
		subj.stopp(0)

	}
}

function adlis() {
	for (let i = 0; i < bts.length; ++i) {
		let x = bts[i];
		x.addEventListener("mousedown", function(event) {
			play(event, this)
		})
		x.addEventListener("mouseup", function(event) {
			play(event, this)
		})
		x.addEventListener("touchstart", function(event) {
			play(event, this)
		})
		x.addEventListener("touchend", function(event) {
			play(event, this)
		})
	}



}

$('#chords').change(function() {
	$('#start').off('click')
	$('#start').on('click', function() {
		rnote = []
		ifst = true
		let tp = getRndInteger(0, osty.length)
		for (let i = 0; i < $('#chords').val(); ++i) {
			let l = getRndInteger(0, oses.length)
			let u = oses[l];
			u.play(0, tp);
			u.stopp(ctx.currentTime + 0.5);
			rnote.push(l)
		}

	})
})

$('#again').on('click', function() {
	let tp = getRndInteger(0, osty.length)
	for (let x of rnote) {
		let u = oses[x];
		u.play(0, tp);
		u.stopp(ctx.currentTime + 0.5);
	}

})
let n = document.getElementById('start')
let v = document.getElementById('again')
$('#free').on('click', function() {
	n.disabled = true;
	v.disabled = true
	document.getElementById('area3').style = 'background-color:none'
	mode = 1
	ifst = false
})
$('#train').on('click', function() {

	n.disabled = false;
	v.disabled = false
	mode = 2
})

document.body.onselectstart = function() {
	return false;
}
$('#refresh').click(function() {
	let a = $('#Arange1').val(),
		b = $('#Arange2').val()
	range[0] = a
	range[1] = b
	oses = []

	crtBts(range)
	adlis()
})


$('#free').click()
$('#Arange1').val(range[0])
$('#Arange2').val(range[1])
$('#chords').val(1)
$('#chords').change()
adlis()
