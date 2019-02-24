
import React, { Component } from 'react'
import { observable, action, reaction } from 'mobx'
import { observer } from 'mobx-react/native'
import { TouchableOpacity, Animated, StyleSheet, Text, View, Switch, Alert } from 'react-native'
import { NavigationContainerProps } from "react-navigation"
import Ionicon from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import i18n, { TLanguage, languages } from '@app/services/i18n'
import globalStore from '@app/stores/global'
import colors from '@app/style/colors'
import * as fonts from '@app/style/fonts'
import * as sizes from '@app/style/sizes'
import * as storage from '@app/services/storage'
import * as LANGUAGE from '@app/constants/language'

interface IProps extends NavigationContainerProps {}

interface ILanguageDetailIconProps extends IProps {
  close: boolean
}

@observer class LanguageDetailIcon extends Component<ILanguageDetailIconProps> {

  constructor(props: ILanguageDetailIconProps) {
    super(props)
    reaction(
      () => this.props.close,
      close => this.opacityAnimate(close ? 1 : 0)
    )
  }

  @observable private opacity = new Animated.Value(1)

  private opacityAnimate(value: number) {
    Animated.timing(
      this.opacity,
      {
        toValue: value,
        duration: 30
      }
    ).start()
  }

  render() {
    const { styles } = obStyles
    return (
      <>
        <Animated.View style={{ opacity: this.opacity }}>
          <Text style={styles.lineItemTitle}>{languages[globalStore.language].name}</Text>
        </Animated.View>
        <FontAwesome
          style={[styles.lineDetailIcon, styles.lineItemTitle]}
          name={this.props.close ? 'angle-right' : 'angle-down'}
        />
      </>
    )
  }
}

@observer export class Setting extends Component<IProps> {

  constructor(props: IProps) {
    super(props)
  }

  @observable.ref isLanguageBoxCollapsed: boolean = true

  @action.bound private updateLanguageBoxCollapsedState(collapsed: boolean) {
    this.isLanguageBoxCollapsed = collapsed
  }

  private handleClearCache(): void {
    Alert.alert(
      i18n.t(LANGUAGE.CLEAR_CACHE),
      i18n.t(LANGUAGE.CLEAR_CACHE_TEXT),
      [
        {
          text: i18n.t(LANGUAGE.CLEAR_CACHE_CANCEL_BUTTON),
          style: 'cancel',
        },
        {
          text: i18n.t(LANGUAGE.CLEAR_CACHE_OK_BUTTON),
          onPress: () => storage.clear()
            .then(() => {
              Alert.alert(i18n.t(LANGUAGE.SUCCESS))
            })
            .catch(error => {
              Alert.alert(i18n.t(LANGUAGE.SUCCESS))
            })
        },
      ],
      { cancelable: false }
    )
  }

  private handleToggleLanguages = () => {
    this.updateLanguageBoxCollapsedState(!this.isLanguageBoxCollapsed)
  }

  private handleUpdateLanguage(language: TLanguage): void {
    globalStore.updateLanguage(language)
  }

  private handleSwitchDarkThemeState(value: boolean): void {
    globalStore.updateDarkTheme(value)
  }

  private renderLanguagesView(): JSX.Element | null {
    if (this.isLanguageBoxCollapsed) {
      return null
    }
    const { styles } = obStyles
    return (
      <>
        {Object.keys(languages).map(language => {
          const lang = language as TLanguage
          return (
            <View key={lang}>
              <TouchableOpacity
                style={[styles.lineItem, styles.lineItemLanguage]}
                onPress={() => this.handleUpdateLanguage(lang)}
              >
                <View style={styles.lineItemLanguageContent}>
                  <Text style={styles.lineItemLanguageTitle}>{languages[lang].name}</Text>
                  <Text style={styles.lineItemLanguageEnglish}>{languages[lang].english}</Text>
                </View>
                <View style={styles.lineItemContent}>
                  <Ionicon
                    name="ios-checkmark"
                    style={[
                      styles.lineDetailIcon,
                      styles.lineItemTitle,
                      fonts.h1,
                      lang === globalStore.language
                        ? { color: colors.primary }
                        : null
                    ]}
                  />
                </View>
              </TouchableOpacity>
              <View style={styles.lineSeparator}></View>
            </View>
          )
        })}
      </>
    )
  }

  render() {
    const { styles } = obStyles
    return (
      <View style={styles.container}>
        <View style={styles.lineSeparator}></View>
        <View style={styles.lineItem}>
          <View style={styles.lineItemContent}>
            <Ionicon style={[styles.lineItemIcon, styles.lineItemTitle]} name="ios-moon" />
            <Text style={styles.lineItemTitle}>{i18n.t(LANGUAGE.DARK_THEME)}</Text>
          </View>
          <View style={styles.lineItemContent}>
            <Switch
              value={globalStore.darkTheme}
              onValueChange={this.handleSwitchDarkThemeState}
            />
          </View>
        </View>
        <View style={styles.lineSeparator}></View>
        <TouchableOpacity
          style={styles.lineItem}
          onPress={this.handleToggleLanguages}
        >
          <View style={styles.lineItemContent}>
            <MaterialIcons style={[styles.lineItemIcon, styles.lineItemTitle]} name="language" />
            <Text style={styles.lineItemTitle}>{i18n.t(LANGUAGE.SWITCH_LANGUAGE)}</Text>
          </View>
          <View style={styles.lineItemContent}>
            <LanguageDetailIcon close={this.isLanguageBoxCollapsed} />
          </View>
        </TouchableOpacity>
        <View style={styles.lineSeparator}></View>
        {this.renderLanguagesView()}
        <View style={[styles.lineSeparator, { marginTop: sizes.gap / 2 }]}></View>
        <TouchableOpacity
          style={[styles.lineItem, styles.lineClearCache]}
          onPress={this.handleClearCache}
        >
          <MaterialIcons style={[styles.lineItemIcon, styles.lineItemTitle]} name="cached" />
          <Text style={styles.lineItemTitle}>{i18n.t(LANGUAGE.CLEAR_CACHE)}</Text>
        </TouchableOpacity>
        <View style={styles.lineSeparator}></View>
      </View>
    )
  }
}

const obStyles = observable({
  get styles() {
    return StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: colors.background,
        paddingTop: sizes.gap
      },
      lineSeparator: {
        width: '100%',
        height: sizes.borderWidth,
        backgroundColor: colors.textMuted
      },
      lineItem: {
        height: sizes.gap * 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: sizes.gap * 0.8,
        backgroundColor: colors.cardBackground
      },
      lineItemLanguage: {
        height: sizes.gap * 3,
        backgroundColor: colors.background
      },
      lineClearCache: {
        justifyContent: 'center',
      },
      lineItemContent: {
        flexDirection: 'row',
      },
      lineItemLanguageContent: {
        flexDirection: 'column',
        justifyContent: 'center'
      },
      lineItemTitle: {
        fontFamily: fonts.fontFamily,
        lineHeight: sizes.gap * 2
      },
      lineItemLanguageTitle: {
        ...fonts.h4
      },
      lineItemLanguageEnglish: {
        ...fonts.small,
      },
      lineItemIcon: {
        ...fonts.h3,
        width: sizes.gap,
        marginRight: sizes.gap / 2,
        color: colors.textTitle
      },
      lineDetailIcon: {
        ...fonts.h3,
        color: colors.textDefault,
        marginLeft: sizes.gap / 2,
      }
    })
  }
})
