const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLATER_STORAGE_KEY = 'F8_PLAYER'

 //lấy element cd
 const  cd =  document.querySelector('.cd')

const heading = document.querySelector('header h2')
const cdThumb = document.querySelector('.cd-thumb')
const audio = document.querySelector('#audio')
const playBtn = document.querySelector('.btn-toggle-play')
const player = document.querySelector('.player')
const progress = document.querySelector('#progress')
const nextBtn = document.querySelector('.btn-next')
const prevBtn = document.querySelector('.btn-prev')
const randomBtn = document.querySelector('.btn-random')
const repeatBtn = document.querySelector('.btn-repeat')
const playlist = document.querySelector('.playlist')


const app = {
    //lấy tt bài hát đầu tiên trong danh sách
    currentIndex:0,
    isPlaying:false,
    isRandom:false,
    isRepeat:false,
    config: JSON.parse(localStorage.getItem(PLATER_STORAGE_KEY)) || {},
    songs: [
         {
            name: 'Khi em lớn',
            singer: 'Orange, Hoàng Dũng',
            path: './musics/Khi em lớn.mp3',
            image: './img/khi em lon.webp'
        
        },
        {
            name: 'Sài Gòn Đau Lòng Quá',
            singer: ' Hứa Kim Tuyền, Hoàng Duyên',
            path: './musics/SaiGonDauLongQua-HuaKimTuyenHoangDuyen-6992977.mp3',
            image: './img/sai gon dau long qua.jpg'
        
        },
        {
            name: 'Con Trai Cưng',
            singer: 'K-ICM, B Ray',
            path: './musics/con trai cung.mp3',
            image: './img/con trai cung.jpg'
        
        },
        {
            name: 'Lối Nhỏ',
            singer: 'Đen',
            path: './musics/Loi Nho (feat. Phuong Anh Dao).m4a',
            image: './img/Loi Nho.jpg'
        
        },
        {
            name: 'Đô Trưởng ',
            singer: 'Đạt G ',
            path: './musics/Do Truong - Dat G.mp3',
            image: './img/do truong.webp'
        
        },
        {
            name: 'Buồn Không em',
            singer: 'Đạt G',
            path: './musics/buon khong em.mp3',
            image: './img/buon khong em.webp'
        
        },
        {
            name: 'Có Một Người Anh Rất Thương',
            singer: 'Phạm Nguyên Ngọc, BMZ',
            path: './musics/Có Một Người Anh Rất Thương.mp3',
            image: './img/co 1 ng anh rat thuong.webp'
        
        },
        {
            name: 'Đi Ngang Ngày Buồn',
            singer: 'Phạm Nguyên Ngọc, Vanh, BMZ',
            path: './musics/Đi Ngang Ngày Buồn.mp3',
            image: './img/Đi Ngang Ngày Buồn.webp'
        
        },
       
    ],
    setConfig: function( key, value ) {
        this.config[key] = value;
        localStorage.setItem(PLATER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function(){

        //render html
        const htms = this.songs.map((song, index) => {
            return`
            
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>

            `
        })
        $('.playlist').innerHTML = htms.join('')
    },

    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvent: function(){
            const _this = this
       
        //lấy cd with offsetWidth là phương thức
        const cdWidth = cd.offsetWidth

        //xử lý cd quay / dừng
        const cdThumbAnimate = cdThumb.animate(
         [{
                transform: 'rotate(360deg)'
            }], {
                iterations: Infinity,
                duration: 9000
            }
        )
        cdThumbAnimate.pause()


        // xử lý phóng to / thu nhỏ CD
        document.onscroll = function(){
             //scroll list musics tùy vào trình duyệt sẽ sử dụng
           const scrollTop = window.scrollY || document.documentElement.scrollTop
            
           // tạo biến newCdWidth và trừ cdWidth và scrollTop 
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0? + newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth

        }
        // xử lý khi click play
        playBtn.onclick = function(){
            if (_this.isPlaying ){   
                audio.pause()
            } else { 
                audio.play()
            }
        }
        // khi song đc player
        audio.onplay = function(){
            _this.isPlaying = true
              // thêm class playing
            player.classList.add('playing')

            // khi nhấn nhấn play thì cd sẽ quay
            cdThumbAnimate.play()
        }
         // khi song đc pause
        audio.onpause = function(){
            _this.isPlaying = false
              // thêm class playing
            player.classList.remove('playing')


              // khi nhấn nhấn play thì cd sẽ dừng
            cdThumbAnimate.pause()
        }
        // khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }
        // xử lý khi tua song 
        progress.oninput = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

       

        //khi next song 
        nextBtn.onclick = function(){

            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.nextSong()
            }          
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        
        //khi prev song 
        prevBtn.onclick = function(){

            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.prevSong()
            }

         
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        
        // xử lý random bật / tắt 
        randomBtn.onclick = function(e){

           _this.isRandom = !_this.isRandom
           _this.setConfig('isRandom', _this.isRandom)
           
            randomBtn.classList.toggle('active', _this.isRandom)

         
        }

       
        // xử lý lập lại song 
        repeatBtn.onclick = function(e) {
            
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)

          
        }

         //xử lý next song khi audio end
         audio.onended = function () {
             if (_this.isRepeat) {
                 audio.play()
             } else {
            nextBtn.click()
             }
        }
        // lắng nghe hành vi click vào playlist 
        playlist.onclick = function(e) {

            const songNode = e.target.closest('.song:not(.active)')
         
            if(songNode|| e.target.closest('.option')){
                  //xử lý khi click vào song
                if (songNode) {
                   _this.currentIndex = Number(songNode.dataset.index)
                   _this.loadCurrentSong()
                   audio.play()
                   _this.render()
                }
                //xử lý khi click vào soption
                if(e.target.closest('.option')){

                }
            }
        }

    },
    loadCurrentSong: function(){
        
        
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

    },
    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
  //next song
    nextSong: function() {
        this.currentIndex++
        if ( this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if ( this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let newIndex
       do {
        newIndex = Math.floor(Math.random() * this.songs.length)
       }
       while (newIndex === this.currentIndex)

       this.currentIndex = newIndex
       this.loadCurrentSong()
    },
    scrollToActiveSong: function(){
        const songs = $$(".song");
        if (this.currentIndex == 0) {
            songs[this.currentIndex].scrollIntoView({ behavior: "smooth", block: "end" });
        } else {
            songs[[this.currentIndex]].scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    },
    start: function(){
        //gán cấu hình từ config vào ứng dụng
        this.loadConfig()

        // lắng nghe/ xử lý các sự kiện dom event
        this.handleEvent()
        // định nghĩa các thuộc tính cho object
        this.defineProperties()

        //tải thông tin bài hát đầu tiên vào giao diện khi chạy ứng dụng
        this.loadCurrentSong()

        //render playlist
        this.render()
        
        //hiển thị trạng thái ban đầu cẩu button reoeat & random
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
}
app.start()
