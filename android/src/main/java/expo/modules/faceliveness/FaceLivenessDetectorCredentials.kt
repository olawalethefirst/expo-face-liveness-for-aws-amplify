package expo.modules.faceliveness

import aws.smithy.kotlin.runtime.time.Instant as SmithyInstant
import com.amplifyframework.auth.AWSCredentials
import com.amplifyframework.auth.AWSCredentialsProvider
import com.amplifyframework.auth.AWSTemporaryCredentials
import com.amplifyframework.auth.AuthException
import com.amplifyframework.core.Consumer
import java.time.Instant

data class FaceLivenessDetectorAWSTemporaryCredentials(
  val accessKeyId: String,
  val secretAccessKey: String,
  val sessionToken: String,
  val expiration: String
) {
  val expirationInstant: Instant
    get() = Instant.parse(expiration)

  fun isCloseToExpiry(): Boolean {
    return expirationInstant.minusSeconds(60).isBefore(Instant.now())
  }
}

object FaceLivenessDetectorCredentialStore {
  private val lock = Any()
  private var credentials: FaceLivenessDetectorAWSTemporaryCredentials? = null

  fun set(newCredentials: FaceLivenessDetectorAWSTemporaryCredentials) {
    synchronized(lock) {
      if (
        newCredentials.accessKeyId.isBlank() ||
        newCredentials.secretAccessKey.isBlank() ||
        newCredentials.sessionToken.isBlank()
      ) {
        throw IllegalStateException("Missing Face Liveness credentials")
      }

      if (newCredentials.isCloseToExpiry()) {
        throw IllegalStateException("Face Liveness credentials are expired or close to expiry")
      }

      credentials = newCredentials
    }
  }

  fun clear() {
    synchronized(lock) {
      credentials = null
    }
  }

  fun getCredentials(): FaceLivenessDetectorAWSTemporaryCredentials {
    synchronized(lock) {
      val current = credentials
        ?: throw IllegalStateException("Missing Face Liveness credentials")

      if (current.isCloseToExpiry()) {
        throw IllegalStateException("Face Liveness credentials are expired or close to expiry")
      }

      return current
    }
  }
}

class FaceLivenessDetectorCredentialsProvider : AWSCredentialsProvider<AWSCredentials> {
  override fun fetchAWSCredentials(
    onSuccess: Consumer<AWSCredentials>,
    onError: Consumer<AuthException>
  ) {
    try {
      val credentials = FaceLivenessDetectorCredentialStore.getCredentials()

      onSuccess.accept(
        AWSTemporaryCredentials(
          accessKeyId = credentials.accessKeyId,
          secretAccessKey = credentials.secretAccessKey,
          sessionToken = credentials.sessionToken,
          expiration = SmithyInstant(credentials.expirationInstant)
        )
      )
    } catch (error: Exception) {
      onError.accept(
        AuthException(
          "Not authorized to perform a face liveness check.",
          "Valid credentials are required for the face liveness check.",
          error
        )
      )
    }
  }
}
