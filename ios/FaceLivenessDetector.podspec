require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'FaceLivenessDetector'
  s.version        = package['version']
  s.summary        = package['description']
  s.description    = package['description']
  s.license        = package['license']
  s.author         = package['author']
  s.homepage       = package['homepage']
  s.platforms      = {
    :ios => '15.1'
  }
  s.swift_version  = '5.9'
  s.source         = { git: 'https://github.com/olawalethefirst/expo-face-liveness-for-aws-amplify' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  spm_dependency(s,
    url: 'https://github.com/aws-amplify/amplify-ui-swift-liveness.git',
    requirement: { kind: 'upToNextMajorVersion', minimumVersion: '1.0.0' },
    products: ['FaceLiveness']
  )

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
