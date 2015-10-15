{
  'targets': [
    {
      'target_name': 'naptcha',
      'conditions': [
        ["OS==\"mac\"", {
            'sources': ['./native-nan/addon.cc', './native-nan/naptcha.cc'],
            'xcode_settings': {
                'GCC_ENABLE_CPP_EXCEPTIONS': 'YES'
            },
            'include_dirs': [ "<!(node -e \"require('nan')\")" ]
        }]
      ],
    }
  ]
}
