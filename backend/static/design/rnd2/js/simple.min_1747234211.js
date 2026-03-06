function getNumbers() {
  try {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/number/", false); // false делает запрос синхронным
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send();

    if (xhr.status >= 200 && xhr.status < 300) {
      const data = JSON.parse(xhr.responseText);
      return data;
    } else {
      throw new Error(`HTTP error! status: ${xhr.status}`);
    }
  } catch (error) {
    console.error("Ошибка при получении чисел:", error);
    return [];
  }
}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const markNumbersAsUsed = (numbers) => {
  for (let i = 0; i < numbers.length; i++) {
    const value = numbers[i];
    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/number/", false);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));
      xhr.send(JSON.stringify({ value }));
      if (xhr.status < 200 || xhr.status >= 300) {
        console.error(
          "Ошибка при отметке числа",
          value,
          `Status: ${xhr.status}`,
        );
      }
    } catch (error) {
      console.error("Ошибка при отметке числа", value, error);
    }
  }
};

const paramMin = document.getElementById("paramMin"),
  paramMax = document.getElementById("paramMax"),
  paramAmount = document.getElementById("paramAmount"),
  paramRepeatsSingle = document.getElementById("paramRepeatsSingle"),
  paramRepeatsSeries = document.getElementById("paramRepeatsSeries"),
  generateButton = document.getElementById("generateButton"),
  lastNumbers = document.getElementById("last_numbers"),
  numberArea = document.getElementById("number_area"),
  currentTime = document.getElementById("current_time"),
  numberViewForm = document.getElementById("number_view_form"),
  settingsForm = document.getElementById("settings_form"),
  lastNumbersTextArea = document.getElementById("last_numbers_textarea"),
  previousNumbersTextArea = document.getElementById(
    "previous_numbers_textarea",
  ),
  settingsListSeparator = document.getElementById("settingsListSeparator"),
  settingsNumberAnimation = document.getElementById("settingsNumberAnimation"),
  settingsSaveParam = document.getElementById("settingsSaveParam"),
  settingsSaveData = document.getElementById("settingsSaveData"),
  settingsShowLastNumbers = document.getElementById("settingsShowLastNumbers"),
  settingsMaskUserEmail = document.getElementById("settingsMaskUserEmail"),
  lastNumberLabel = document.getElementById("last_numbers_label"),
  lastNumbersCount = document.getElementById("last_numbers_count"),
  previousNumbersCount = document.getElementById("previous_numbers_count"),
  contentColumn = document.getElementById("contentColumn"),
  titleInfo = document.getElementById("titleInfo"),
  titleHolder = document.getElementById("titleHolder"),
  scrollButton = document.getElementById("scrollButton");
class SimpleControl {
  constructor() {
    ((this.currentSessionNumbers = new Set()),
      (this.resultNumbers = []),
      (this.currentResultNumbers = []),
      (this.currentResultTimestamp = null),
      (this.currentRange = null),
      (this.lastGenerateParam = null),
      (this.restoreMessage = null),
      (this.restoreDataTimeout = 6e5),
      (this.maxRangeSizeForFill = 1e6),
      (this.numberScrollDelay = 2500),
      (this.maxScrollNumbers = 5),
      (this.mediumFontSize = 4),
      (this.smallFontSize = 2),
      (this.maxFontSize = 10),
      (this.minFontSize = 1),
      (this.stepFontSize = 0.25),
      (this.contentBottomPadding = 10),
      (this.messageNoNumbers = "Чисел больше нет"),
      (this.clearTypes = {
        seriesAndLast: "seriesAndLast",
        series: "series",
        last: "last",
        all: "all",
      }),
      (this.storageKeys = {
        param: "simpleParam",
        settings: "simpleSettings",
        data: "simpleData",
      }),
      (this.settings = {
        listSeparator: 0,
        numberAnimation: !0,
        saveParam: !0,
        saveData: !0,
        showLastNumbers: !0,
        maskUserEmail: !0,
      }),
      (this.paramLimits = {
        numberMin: 0,
        numberMax: 999999999,
        amountMin: 1,
        amountMax: 5e4,
      }),
      (this.param_default = {
        min: 1,
        max: 9999,
        amount: 1,
        rangeSize: 9999,
        repeatsSingle: !1,
        repeatsSeries: !1,
      }),
      (this.param = structuredClone(this.param_default)),
      document.documentElement.style.setProperty("--animate-duration", "0.5s"),
      this.setParamLimits(),
      this.resizeControlElements(),
      this.restoreSettings());
    (Array.prototype.slice
      .call(document.getElementsByClassName("simple-settings"), 0)
      .forEach((e) => {
        e.addEventListener("input", () => {
          this.changeSettings();
        });
      }),
      this.restoreParam());
    (Array.prototype.slice
      .call(document.getElementsByClassName("simple-param"), 0)
      .forEach((e) => {
        e.addEventListener("change", () => {
          this.changeParam();
        });
      }),
      this.checkRestoreData());
  }
  checkRestoreData() {
    if (!this.settings.saveData) return;
    let e = this.getObjectFromStorage(this.storageKeys.data);
    if (null !== e && e.lastUpdateTimestamp)
      if (
        Date.now() - e.lastUpdateTimestamp > this.restoreDataTimeout &&
        e.resultNumbers &&
        e.resultNumbers.length > 0
      ) {
        let t = new Date(e.lastUpdateTimestamp),
          s = t.toLocaleString();
        (t.toDateString() === new Date().toDateString() &&
          (s = `сегодня в ${t.toLocaleTimeString()}`),
          (this.restoreMessage = document.createElement("a")),
          this.restoreMessage.classList.add(
            "rnd-simple-last-data",
            "button",
            "is-white",
            "has-text-weight-normal",
            "animate__animated",
          ),
          (this.restoreMessage.innerHTML = `Загрузить сохраненные данные?<br>\n <span class="has-text-weight-light">Обновлены ${s}</span>`),
          (this.restoreMessage.onclick = () => {
            this.restoreData();
          }),
          numberArea.appendChild(this.restoreMessage),
          setTimeout(() => {
            this.restoreMessage.classList.add("animate__bounceIn");
          }, 100));
      } else this.restoreData(e);
  }
  setParamLimits() {
    ((paramMin.min = paramMax.min = this.paramLimits.numberMin),
      (paramMin.max = paramMax.max = this.paramLimits.numberMax),
      (paramMin.placeholder = rnd_format_number(this.paramLimits.numberMin)),
      (paramMax.placeholder = rnd_format_number(this.paramLimits.numberMax)),
      (paramAmount.min = this.paramLimits.amountMin),
      (paramAmount.max = this.paramLimits.amountMax));
  }
  restoreSettings() {
    let e = this.getObjectFromStorage(this.storageKeys.settings);
    if (null !== e) for (let t in e) this.settings[t] = e[t];
    ((settingsListSeparator.value = this.settings.listSeparator),
      (settingsNumberAnimation.checked = this.settings.numberAnimation),
      (settingsSaveParam.checked = this.settings.saveParam),
      (settingsSaveData.checked = this.settings.saveData),
      (settingsShowLastNumbers.checked = this.settings.showLastNumbers),
      (settingsMaskUserEmail.checked = this.settings.maskUserEmail),
      this.toggleLastNumbersLine(this.settings.showLastNumbers),
      this.toggleUserEmail(!this.settings.maskUserEmail));
  }
  restoreParam(e = !1) {
    if (!this.settings.saveParam && !e) return;
    let t = this.getObjectFromStorage(this.storageKeys.param);
    if (null !== t) for (let e in t) this.param[e] = t[e];
    ((paramMin.value = this.param.min),
      (paramMax.value = this.param.max),
      (paramAmount.value = this.param.amount),
      (paramRepeatsSingle.checked = this.param.repeatsSingle),
      (paramRepeatsSeries.checked = this.param.repeatsSingle),
      this.changeParam(!0));
  }
  restoreData(e = null) {
    (null == e &&
      null === (e = this.getObjectFromStorage(this.storageKeys.data))) ||
      (e.currentSessionNumbers &&
        (this.currentSessionNumbers = new Set(e.currentSessionNumbers)),
      e.resultNumbers && (this.resultNumbers = e.resultNumbers),
      e.currentResultNumbers &&
        ((this.currentResultNumbers = e.currentResultNumbers),
        this.currentResultNumbers.length > 0 && this.toggleTitleInfo(!1)),
      e.currentResultTimestamp &&
        (this.currentResultTimestamp = e.currentResultTimestamp),
      this.currentResultNumbers.length > 0
        ? this.updateLastNumbers(
            this.resultNumbers.slice(0, -this.currentResultNumbers.length),
            !0,
          )
        : this.updateLastNumbers(this.resultNumbers, !0),
      this.updateAllData(),
      this.renderResults(!0));
  }
  saveObjectToStorage(e, t) {
    localStorage.setItem(e, JSON.stringify(t));
  }
  getObjectFromStorage(e) {
    let t = localStorage.getItem(e);
    return t ? JSON.parse(t) : null;
  }
  getGenerateParams() {
    return {
      min: parseInt(paramMin.value),
      max: parseInt(paramMax.value),
      amount: parseInt(paramAmount.value),
      repeatsSingle: paramRepeatsSingle.checked,
      repeatsSeries: paramRepeatsSeries.checked,
      rangeSize: paramMax.value - paramMin.value + 1,
    };
  }
  fillCurrentRange(e) {
    if (e.max - e.min + 1 <= this.maxRangeSizeForFill) {
      this.currentRange = new Set();
      for (let t = e.min; t <= e.max; t++) this.currentRange.add(t);
    } else this.currentRange = null;
  }
  generateNumber() {
    this.disabledGenerateButton();
    window.scroll({ top: 0, behavior: "smooth" });
    currentTime.classList.remove("animate__bounceIn");
    numberArea.classList.remove("animate__bounceIn");

    this.currentResultNumbers = [];
    this.currentResultTimestamp = null;

    let tempSet = new Set(); // Числа, сгенерированные в текущем вызове
    this.changeParam(!0);

    let availableInRange = null;
    const numbersAdmin = getNumbers(); // Получаем список админ-чисел

    if (null !== this.currentRange) {
      availableInRange = this.currentRange.difference(
        this.currentSessionNumbers,
      );
    }

    if (Array.isArray(numbersAdmin) && numbersAdmin.length > 0) {
      for (const adminNum of numbersAdmin) {
        if (this.currentResultNumbers.length >= this.param.amount) break;
        const num = Number(adminNum);
        const inRange = num >= this.param.min && num <= this.param.max;
        const isUniqueInSession =
          this.param.repeatsSeries || !this.currentSessionNumbers.has(num);
        const isUniqueInCurrentSet =
          this.param.repeatsSingle || !tempSet.has(num);

        if (inRange && isUniqueInSession && isUniqueInCurrentSet) {
          this.currentResultNumbers.push(num);
          tempSet.add(num);
          if (!this.param.repeatsSingle) {
            this.currentSessionNumbers.add(num);
          }
          if (availableInRange) {
            availableInRange.delete(num);
          }

            markNumbersAsUsed([adminNum]);
            console.log(adminNum, "adminNum")
        }
      }
    }

    try {
      while (this.currentResultNumbers.length < this.param.amount) {
        if (
          !this.param.repeatsSeries &&
          ((null === availableInRange &&
            this.param.rangeSize <= this.currentSessionNumbers.size) ||
            (null !== availableInRange && 0 === availableInRange.size))
        ) {
          if (this.currentResultNumbers.length) break;
          throw new Error(
            "Невозможно сгенерировать больше уникальных чисел с заданными ограничениями.",
          );
        }

        const rndNum = rnd_get_random_int(this.param.min, this.param.max);

        const isUniqueInSession =
          this.param.repeatsSeries || !this.currentSessionNumbers.has(rndNum);
        const isUniqueInCurrentSet =
          this.param.repeatsSingle || !tempSet.has(rndNum);

        if (isUniqueInSession && isUniqueInCurrentSet) {
          this.currentResultNumbers.push(rndNum);
          tempSet.add(rndNum);

          if (!this.param.repeatsSingle) {
            this.currentSessionNumbers.add(rndNum);
          }
          if (availableInRange) {
            availableInRange.delete(rndNum);
          }
        }
      }
    } catch (err) {
      console.error(err.message);
    }

    if (this.param.repeatsSingle) {
      this.currentSessionNumbers = this.currentSessionNumbers.union(tempSet);
    }

    this.resultNumbers.push(...this.currentResultNumbers);

    setTimeout(() => {
      this.renderResults();
    });
  }

  fixedTimestamp() {
    this.currentResultNumbers.length > 0
      ? (this.currentResultTimestamp = rnd_format_date(new Date()))
      : (this.currentResultTimestamp = null);
  }
  saveData() {
    this.saveObjectToStorage(this.storageKeys.data, {
      currentSessionNumbers: [...this.currentSessionNumbers],
      resultNumbers: this.resultNumbers,
      currentResultNumbers: this.currentResultNumbers,
      currentResultTimestamp: this.currentResultTimestamp,
      lastUpdateTimestamp: Date.now(),
    });
  }
  disabledGenerateButton() {
    ((generateButton.disabled = !0),
      generateButton.classList.add("is-loading"));
  }
  enabledGenerateButton() {
    ((generateButton.disabled = !1),
      generateButton.classList.remove("is-loading"));
  }
  renderResults(e = !1) {
    if (
      ((currentTime.innerHTML = "&nbsp;"),
      numberArea.classList.remove("rnd-simple-number-area-texted"),
      0 === this.currentResultNumbers.length)
    ) {
      if (e) return;
      return (
        document.documentElement.style.setProperty(
          "--rnd-simple-font-size",
          `${this.mediumFontSize}rem`,
        ),
        (numberArea.innerHTML = this.messageNoNumbers),
        setTimeout(() => {
          (numberArea.classList.add("animate__bounceIn"),
            this.enabledGenerateButton());
        }),
        void this.saveData()
      );
    }
    if (
      (this.toggleTitleInfo(!1),
      (numberArea.innerHTML = ""),
      this.currentResultNumbers.length > 1 &&
        document.documentElement.style.setProperty(
          "--rnd-simple-font-size",
          `${this.currentResultNumbers.length >= 25 ? this.smallFontSize : this.mediumFontSize}rem`,
        ),
      this.currentResultNumbers.length <= 200)
    ) {
      let t = !0;
      this.currentResultNumbers.forEach((s) => {
        let a = document.createElement("div");
        if (
          ((a.innerText = s),
          numberArea.appendChild(a),
          1 === this.currentResultNumbers.length)
        ) {
          let e = this.maxFontSize;
          do {
            (document.documentElement.style.setProperty(
              "--rnd-simple-font-size",
              `${e}rem`,
            ),
              (e -= this.stepFontSize));
          } while (
            a.offsetWidth + 2 * parseInt(getComputedStyle(a).marginLeft) >
              numberArea.offsetWidth &&
            e > this.minFontSize
          );
        }
        if (
          this.currentResultNumbers.length <= this.maxScrollNumbers &&
          this.settings.numberAnimation &&
          !e
        ) {
          (a.classList.add("rnd-simple-numbers-block-scroll"),
            new Odometer({
              el: a,
              value: 0 === s ? 9 : 0,
              framerate: 30,
              delay: this.numberScrollDelay,
              format: "",
            }).update(s),
            a.addEventListener("odometerdone", () => {
              t &&
                ((t = !1),
                e || (this.fixedTimestamp(), this.saveData()),
                this.updateDataAfterRender());
            }));
        } else
          t &&
            ((t = !1),
            e || (this.fixedTimestamp(), this.saveData()),
            this.updateDataAfterRender(),
            numberArea.classList.add("animate__bounceIn"));
      });
    } else
      (numberArea.classList.add("rnd-simple-number-area-texted"),
        (numberArea.innerText = this.currentResultNumbers.join(" ")),
        this.fixedTimestamp(),
        this.saveData(),
        this.updateDataAfterRender(),
        numberArea.classList.add("animate__bounceIn"));
    this.scrollControl();
  }
  updateDataAfterRender() {
    (this.updateLastNumbers(this.currentResultNumbers),
      this.updateAllData(),
      this.enabledGenerateButton(),
      (currentTime.innerHTML = this.currentResultTimestamp ?? "&nbsp;"),
      currentTime.classList.add("animate__bounceIn"));
  }
  updateLastNumbers(e, t) {
    (e = e.slice(-30)).forEach((e) => {
      let s = document.createElement("span");
      ((s.innerText = e),
        s.classList.add(
          "rnd-simple-numbers",
          "animate__animated",
          "animate__bounceIn",
        ),
        t || s.classList.add("rnd-simple-numbers-new"),
        lastNumbers.appendChild(s));
    });
    let s = !1;
    for (; lastNumbers.offsetWidth < lastNumbers.scrollWidth; )
      (lastNumbers.removeChild(lastNumbers.firstChild), (s = !0));
    (s &&
      ((lastNumbers.children[0].style.opacity = 0.3),
      lastNumbers.children[0].classList.remove(
        "animate__animated",
        "animate__bounceIn",
      ),
      (lastNumbers.children[1].style.opacity = 0.7),
      lastNumbers.children[1].classList.remove(
        "animate__animated",
        "animate__bounceIn",
      )),
      setTimeout(() => {
        document.querySelectorAll(".rnd-simple-numbers-new").forEach((e) => {
          e.classList.remove("rnd-simple-numbers-new");
        });
      }));
  }
  showLastNumbersDialog() {
    (this.updateAllData(), rnd_openModal(numberViewForm));
  }
  updateAllData() {
    (this.changeSeparator(settingsListSeparator),
      (lastNumbersCount.innerText = this.resultNumbers.length.toString()),
      (previousNumbersCount.innerText =
        this.currentSessionNumbers.size.toString()),
      this.resultNumbers.length > 0
        ? (lastNumberLabel.innerText = `Последние номера (${this.resultNumbers.length})`)
        : ((lastNumberLabel.innerText = "Последние номера"),
          (lastNumbers.innerText = "")));
  }
  clearNumbers(e, t = !0) {
    if (t) {
      let t =
        "Вы уверены, что хотите очистить список сгенерированных чисел и текущую серию?";
      switch (e) {
        case this.clearTypes.series:
          t =
            "Вы уверены, что хотите очистить текущую серию чисел?\nРанее выпавшие номера могут быть сгенерированы снова.";
          break;
        case this.clearTypes.last:
          t =
            "Вы уверены, что хотите очистить список всех сгенерированных чисел?";
          break;
        case this.clearTypes.all:
          t = "Сбросить параметры и очистить результаты?";
      }
      if (!confirm(t)) return;
    }
    ((e !== this.clearTypes.series &&
      e !== this.clearTypes.seriesAndLast &&
      e !== this.clearTypes.all) ||
      (this.currentSessionNumbers = new Set()),
      (e !== this.clearTypes.last &&
        e !== this.clearTypes.seriesAndLast &&
        e !== this.clearTypes.all) ||
        ((this.resultNumbers = []),
        (this.currentResultNumbers = []),
        (this.currentResultTimestamp = null),
        this.toggleTitleInfo(!0),
        (currentTime.innerHTML = "&nbsp"),
        document.documentElement.style.setProperty(
          "--rnd-simple-font-size",
          `${this.mediumFontSize}rem`,
        )),
      e === this.clearTypes.all &&
        ((this.param = structuredClone(this.param_default)),
        this.saveObjectToStorage(this.storageKeys.param, this.param),
        this.restoreParam(!0),
        this.enabledGenerateButton()),
      this.saveData(),
      this.updateAllData(),
      e !== this.clearTypes.series &&
        window.scroll({ top: 0, behavior: "smooth" }));
  }
  changeSeparator(e) {
    const t = [", ", "; ", ",", ";", " ", "\n", "\t"];
    ((lastNumbersTextArea.textContent = this.resultNumbers.join(t[e.value])),
      (previousNumbersTextArea.textContent = Array.from(
        this.currentSessionNumbers,
      ).join(t[e.value])));
  }
  changeSettings() {
    (this.changeSeparator(settingsListSeparator),
      (this.settings.listSeparator = settingsListSeparator.value),
      (this.settings.numberAnimation = settingsNumberAnimation.checked),
      (this.settings.saveParam = settingsSaveParam.checked),
      (this.settings.saveData = settingsSaveData.checked),
      (this.settings.showLastNumbers = settingsShowLastNumbers.checked),
      (this.settings.maskUserEmail = settingsMaskUserEmail.checked),
      this.saveObjectToStorage(this.storageKeys.settings, this.settings),
      this.toggleLastNumbersLine(this.settings.showLastNumbers),
      this.toggleUserEmail(!this.settings.maskUserEmail));
  }
  changeParam(e = !1) {
    let t = this.getGenerateParams();
    if (t.min > t.max) {
      let e = t.min;
      ((t.min = t.max), (t.max = e));
    }
    ((t.min = Math.max(
      this.paramLimits.numberMin,
      Math.min(t.min, this.paramLimits.numberMax),
    )),
      (t.max = Math.min(
        this.paramLimits.numberMax,
        Math.max(t.max, this.paramLimits.numberMin),
      )),
      (t.amount = Math.max(
        this.paramLimits.amountMin,
        Math.min(t.amount, this.paramLimits.amountMax),
      )),
      (paramMin.value = t.min),
      (paramMax.value = t.max),
      (paramAmount.value = t.amount),
      t.amount === this.paramLimits.amountMin
        ? (paramRepeatsSingle.disabled = !0)
        : (paramRepeatsSingle.disabled = !1),
      null === this.lastGenerateParam &&
        (this.lastGenerateParam = structuredClone(t)));
    let s = !1;
    if (
      ((t.min === this.lastGenerateParam.min &&
        t.max === this.lastGenerateParam.max) ||
        (s = !0),
      e && (this.lastGenerateParam = structuredClone(t)),
      (this.param = structuredClone(t)),
      e && (s || null === this.currentRange) && this.fillCurrentRange(t),
      s && e && this.currentSessionNumbers.size > 0)
    ) {
      confirm(
        "Изменился диапазон чисел. Очистить текущую серию без повторов? Уже сгенерированные числа смогут выпасть вновь.",
      ) && ((this.currentSessionNumbers = new Set()), this.saveData());
    }
    this.saveObjectToStorage(this.storageKeys.param, this.param);
  }
  toggleLastNumbersLine(e) {
    (e
      ? (lastNumbers.classList.remove("is-hidden"),
        lastNumberLabel.classList.remove("is-hidden"),
        setTimeout(() => {
          this.updateLastNumbers([], !0);
        }))
      : (lastNumbers.classList.add("is-hidden"),
        lastNumberLabel.classList.add("is-hidden")),
      this.resizeControlElements());
  }
  toggleTitleInfo(e) {
    e
      ? titleHolder.contains(titleInfo)
        ? ((numberArea.innerHTML = ""),
          numberArea.classList.remove("rnd-simple-number-area-texted"),
          numberArea.appendChild(titleInfo))
        : this.restoreMessage &&
          (this.restoreMessage.remove(), (this.restoreMessage = null))
      : numberArea.contains(titleInfo) && titleHolder.appendChild(titleInfo);
  }
  toggleUserEmail(e) {
    const t = document.getElementById("user_menu_dropdown");
    if (!t) return;
    const s = t.childNodes[2] ?? null;
    s &&
      (e
        ? t.dataset.hidenEmail && (s.textContent = t.dataset.hidenEmail)
        : ((t.dataset.hidenEmail = s.textContent),
          (s.textContent = "Мой кабинет")));
  }
  resizeControlElements() {
    const e = contentColumn.getBoundingClientRect(),
      t = numberArea.getBoundingClientRect(),
      s =
        document.documentElement.clientHeight -
        e.top -
        window.scrollY -
        (e.height - t.height) -
        this.contentBottomPadding;
    numberArea.style.minHeight = `${s}px`;
    try {
      this.scrollControl();
    } catch {
      this.simpleControl.scrollControl();
    }
  }
  scrollControl() {
    const e = contentColumn.getBoundingClientRect(),
      t = e.bottom + window.scrollY,
      s = Math.min(
        e.left + e.width + 30,
        document.documentElement.clientWidth - scrollButton.offsetWidth - 30,
      ),
      a = window.scrollY + document.documentElement.clientHeight;
    ((scrollButton.style.left = `${s}px`),
      a >= t
        ? (scrollButton.classList.add("fade"),
          scrollButton.addEventListener(
            "transitionend",
            () => {
              scrollButton.classList.add("is-hidden");
            },
            { once: !0 },
          ))
        : (scrollButton.classList.remove("is-hidden"),
          setTimeout(() => {
            scrollButton.classList.remove("fade");
          })));
  }
  scrollToControl() {
    const e = contentColumn.getBoundingClientRect().bottom + window.scrollY;
    window.scroll({
      top:
        e - document.documentElement.clientHeight + this.contentBottomPadding,
      behavior: "smooth",
    });
  }
}
var simpleControl = new SimpleControl();
((window.onresize = simpleControl.resizeControlElements),
  (window.onscroll = simpleControl.scrollControl));
