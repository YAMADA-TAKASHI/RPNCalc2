import React, { Component, Fragment } from "react";
import { 
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
  TouchableOpacity,
} from "react-native";

const STATUSBAR_HEIGHT = Platform.OS == 'ios' ? 20 : StatusBar.currentHeight;

const CalcButton = (props) => {
  const flex = props.flex ? props.flex : 1
  return (
    <TouchableOpacity
      style={[styles.calcButton, {flex: flex}]}
      onPress={() => {props.btnEvent()}}>
      <Text style={styles.calcButtonText}>{props.label}</Text>
    </TouchableOpacity>
  )
}

//ボタンのFlagmentを返すFuctional Component
const CalcButtons = (props) => {
  return (
    <Fragment>
      { props.buttons.map(button => {
        return (
          <CalcButton
            key={button.label}
            flex={button.flex}
            label={button.label}
            btnEvent={button.btnEvent}
          />
        )
      })}
    </Fragment>
  )
}

export default class App extends Component {

  buttons = [
    [
      {
        label: 'AC',
        flex: 2,
        btnEvent: () => {this.acButton()},
      },
      {
        label: 'C',
        btnEvent: () => {this.cButton()},
      },
      {
        label: '+',
        btnEvent: () => {this.calcButton('+')},
      }
    ],
    [
      {
        label: '7',
        btnEvent: () => {this.valueButton('7')},
      },
      {
        label: '8',
        btnEvent: () => {this.valueButton('8')},
      },
      {
        label: '9',
        btnEvent: () => {this.valueButton('9')},
      },
      {
        label: '-',
        btnEvent: () => {this.calcButton('7')},
      },
    ],
    [
      {
        label: '4',
        btnEvent: () => {this.valueButton('4')},
      },
      {
        label: '5',
        btnEvent: () => {this.valueButton('5')},
      },
      {
        label: '6',
        btnEvent: () => {this.valueButton('6')},
      },
      {
        label: '*',
        btnEvent: () => {this.calcButton('*')},
      },
    ],
    [
      {
        label: '1',
        btnEvent: () => {this.valueButton('1')},
      },
      {
        label: '2',
        btnEvent: () => {this.valueButton('2')},
      },
      {
        label: '3',
        btnEvent: () => {this.valueButton('3')},
      },
    ],
    [
      {
        label: '0',
        btnEvent: () => {this.valueButton('0')},
      },
      {
        label: '.',
        btnEvent: () => {this.valueButton('.')},
      },
      {
        label: '/',
        btnEvent: () => {this.calcButton('/')},
      },
    ],
    [
      {
        label: 'Enter',
        btnEvent: () => {this.enterButton()}
      }
    ]
  ]

  constructor(props) {
    super(props)
    this.state = {
      results: [],  //1: スタックが入る配列
      current: "0", //2: 現在入力中のあたいの文字列
      dotInputed: false, //3: .が入力されているかどうか
      afterValueButton: false, //4: 数字ボタンが入力された後かどうか
    }
  }

  valueButton = (value) => {
    let currentString = this.state.current
    const dotInputed = this.state.dotInputed
    let newDotInputed = dotInputed
    
    if(value == ".") {
      //.は2回入力されたら無視
      if(!dotInputed) {
        currentString = currentString + value
        newDotInputed = true
      }
    } else if (currentString == "0") {  //初期入力時は値をそのまま保持
      currentString = value
    } else {
      currentString = currentString + value
    }
    this.setState({current: currentString, dotInputed: newDotInputed, afterValueButton: true})
  }

  enterButton = () => {
    let newValue = NaN
    if (this.state.dotInputed) {
      newValue = parseFloat(this.state.current)
    } else {
      newValue = parseInt(this.state.current)
    }

    //パースに失敗したらスタックにつまない
    if (isNaN(newValue)) {
      return;
    }

    //スタックに新しい値を積む
    let results = this.state.results
    results.push(newValue)
    this.setState({current: "0", dotInputed: false, results: results, afterValueButton: false})
  }

  calcButton = (value) => {
    //スタックが2つ以上ない場合は計算しない
    if (this.state.results.length < 2) {
      return
    }

    //数値を入力中は受け付けない(スタックにあるものだけを処理する)
    if (this.state.afterValueButton == true) {
      return
    }

    let newResults = this.state.results
    const target2 = newResults.pop()
    const target1 = newResults.pop()
    newValue = null

    //スタックから取得したものを計算する
    switch (value) {
      case '+':
        newValue = target1 + target2
        break
      case '-':
        newValue = target1 - target2
        break
      case '*':
        newValue = target1 * target2
        break
      case '/':
        newValue = target1 / target2

        //0で割ったときに何もしないように有限性をチェック
        if (!isFinate(newValue)) {
          newValue = null
        }
        break

      default:
        break
    }

    if (newValue == null) {
      return
    }
    //計算結果をスタックに積む
    newResults.push(newValue)
    this.setState({current: "0", dotInputed: false, results: newResults, afterValueButton: false})
  }

  acButton = () => {
    //ACボタンハスタックを含めて初期化する
    this.setState({current: "0", dotInputed: false, results: [], afterValueButton: false})
  }

  cButton = () => {
    //Cボタンはスタック以外を初期化する
    this.setState({current: "0", dotInputed: false, afterValueButton: false})
  }

  render() {
    return (
      <View style={styles.container}>
        { /* 結果を表示するView*/ }
        <View style={styles.results}>
          <View style={styles.resultLine}>
          </View>
          <View style={styles.resultLine}>
            <Text>{this.state.current}</Text>
          </View>
          <View style={styles.resultLine}>
            <Text>{this.state.results.join(' ')}</Text>
          </View>
        </View>
        { /* ボタンを表示するView*/ }
        <View style={styles.buttons}>
          <View style={styles.buttonsLine}>
            { /* ボタンを配置 */ }
            <CalcButtons buttons={this.buttons[0]} />
          </View>
          <View style={styles.buttonsLine}>
            { /* ボタンを配置 */ }
            <CalcButtons buttons={this.buttons[1]} />
          </View>
          <View style={styles.buttonsLine}>
            { /* ボタンを配置 */ }
            <CalcButtons buttons={this.buttons[2]} />
          </View>
          <View style={styles.lastButtonLinesContainer}>
            <View style={styles.twoButtonLines}>
              <View style={styles.buttonsLine}>
                { /* ボタンを配置 */ }
                <CalcButtons buttons={this.buttons[3]} />
              </View>
              <View style={styles.buttonsLine}>
                { /* ボタンを配置 */ }
                <CalcButtons buttons={this.buttons[4]} />
              </View>
            </View>
            <View style={styles.enterButtonContainer}>
              { /* ボタンを配置 */ }
              <CalcButtons buttons={this.buttons[5]} />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: STATUSBAR_HEIGHT,
  },
  results: {
    flex: 3,
    backgroundColor: '#fff',
  },
  resultLine: {
    flex: 1,
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  buttons: {
    flex: 5,
  },
  buttonsLine: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    alignItems: 'center',
    borderWidth: 1,
  },
  lastButtonLinesContainer: {
    flex: 2,
    flexDirection: 'row',
  },
  twoButtonLines: {
    flex: 3,
  },
  enterButtonContainer: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
  },
  calcButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: "#b0c4de",
  },
  calcButtonText: {
    fontSize: 20,
  },
});

