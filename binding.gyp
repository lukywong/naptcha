{
  'targets': [
    {
      'target_name': 'naptcha',
      'sources': ['./native-nan/addon.cc', './native-nan/naptcha.cc'],
      'conditions': [
        ["OS==\"mac\"", {
            'xcode_settings': {
                'GCC_ENABLE_CPP_EXCEPTIONS': 'YES'
            },
            'include_dirs': [ "<!(node -e \"require('nan')\")" ]
        }]
      ],
    }
  ]
}
